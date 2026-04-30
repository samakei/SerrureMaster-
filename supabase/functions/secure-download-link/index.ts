// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const defaultBucket = Deno.env.get('PRIVATE_CONTENT_BUCKET') || 'secure-pdfs';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const normalizeObjectPath = (filePath: string, bucket: string) => {
  if (filePath.startsWith(`${bucket}/`)) {
    return filePath.slice(bucket.length + 1);
  }
  return filePath;
};

const isAllowedProductPath = (productId: string, filePath: string, bucket: string) => {
  const shortId = productId.split('_')[0];
  const allowedPrefixes = [
    `${bucket}/${shortId}/`,
    `${bucket}/${productId}/`,
    `${shortId}/`,
    `${productId}/`,
  ];
  return allowedPrefixes.some((prefix) => filePath.startsWith(prefix));
};

const logDownloadEvent = async (payload: Record<string, unknown>) => {
  try {
    await supabaseAdmin.from('download_logs').insert(payload);
  } catch (error) {
    console.warn('download_logs insert skipped:', error?.message || error);
  }
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return new Response(JSON.stringify({ error: 'Session manquante' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Utilisateur non authentifié' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = await req.json();
  const productId = body?.productId as string | undefined;
  const fileName = body?.fileName as string | undefined;
  const filePath = body?.filePath as string | undefined;
  const accessType = (body?.accessType as string | undefined) || 'pdf';
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';

  if (!productId || !filePath || !fileName) {
    await logDownloadEvent({
      user_id: user.id,
      product_id: productId || null,
      file_name: fileName || null,
      file_path: filePath || null,
      access_type: accessType,
      decision: 'error',
      reason: 'missing_payload',
      ip,
      user_agent: userAgent,
    });

    return new Response(JSON.stringify({ error: 'Payload incomplet' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!isAllowedProductPath(productId, filePath, defaultBucket)) {
    await logDownloadEvent({
      user_id: user.id,
      product_id: productId,
      file_name: fileName,
      file_path: filePath,
      access_type: accessType,
      decision: 'denied',
      reason: 'invalid_file_path',
      ip,
      user_agent: userAgent,
    });

    return new Response(JSON.stringify({ error: 'Chemin fichier invalide' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (fileName.toLowerCase().includes('draft')) {
    await logDownloadEvent({
      user_id: user.id,
      product_id: productId,
      file_name: fileName,
      file_path: filePath,
      access_type: accessType,
      decision: 'denied',
      reason: 'draft_resource',
      ip,
      user_agent: userAgent,
    });

    return new Response(JSON.stringify({ error: 'Ce document est en cours de validation' }), {
      status: 409,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data: purchase, error: purchaseError } = await supabaseAdmin
    .from('user_products')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();

  if (purchaseError || !purchase) {
    await logDownloadEvent({
      user_id: user.id,
      product_id: productId,
      file_name: fileName,
      file_path: filePath,
      access_type: accessType,
      decision: 'denied',
      reason: purchaseError?.message || 'product_not_owned',
      ip,
      user_agent: userAgent,
    });

    return new Response(JSON.stringify({ error: 'Accès refusé. Produit non acquis.' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const objectPath = normalizeObjectPath(filePath, defaultBucket);
  const { data: signed, error: signedError } = await supabaseAdmin.storage
    .from(defaultBucket)
    .createSignedUrl(objectPath, 60 * 15);

  if (signedError || !signed?.signedUrl) {
    await logDownloadEvent({
      user_id: user.id,
      product_id: productId,
      file_name: fileName,
      file_path: filePath,
      access_type: accessType,
      decision: 'error',
      reason: signedError?.message || 'signed_url_failed',
      ip,
      user_agent: userAgent,
    });

    return new Response(
      JSON.stringify({ error: 'Fichier sécurisé indisponible. Vérifiez le bucket et le chemin.' }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  await logDownloadEvent({
    user_id: user.id,
    product_id: productId,
    file_name: fileName,
    file_path: filePath,
    access_type: accessType,
    decision: 'granted',
    reason: 'signed_url_generated',
    ip,
    user_agent: userAgent,
  });

  return new Response(
    JSON.stringify({
      success: true,
      url: signed.signedUrl,
      expiresAt: Date.now() + 15 * 60 * 1000,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
});
