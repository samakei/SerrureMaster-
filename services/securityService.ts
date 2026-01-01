import { User } from '../types';

/**
 * ==========================================
 * DOCUMENTATION CONFIGURATION SUPABASE (RLS)
 * ==========================================
 * ... (Documentation remains valid) ...
 */

export interface SignedUrlResponse {
  success: boolean;
  url?: string;
  error?: string;
  expiresAt?: number;
}

interface AuditLogEntry {
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  ip: string;
  status: 'SUCCESS' | 'DENIED';
}

const mockAuditLogDB: AuditLogEntry[] = [];

const logSecurityEvent = (entry: AuditLogEntry) => {
  mockAuditLogDB.push(entry);
  console.group('%c[SECURITY AUDIT LOG]', 'color: red; font-weight: bold;');
  console.log(`Time: ${entry.timestamp}`);
  console.log(`User: ${entry.userId}`);
  console.log(`IP: ${entry.ip}`);
  console.log(`Action: ${entry.action} on ${entry.resource}`);
  console.log(`Status: ${entry.status}`);
  console.groupEnd();
};

export const generateSecureLink = async (
  user: User,
  productId: string,
  fileName: string
): Promise<SignedUrlResponse> => {
  // UX Optimization: Reduced artificial delay from 1200ms to 600ms
  // Keeps the "secure processing" feel without being annoying
  await new Promise((resolve) => setTimeout(resolve, 600));

  const clientIp = '192.168.1.' + Math.floor(Math.random() * 255);
  const timestamp = new Date().toISOString();

  try {
    // ---------------------------------------------------------
    // ÉTAPE 1 : Vérification Authentification
    // ---------------------------------------------------------
    if (!user || !user.id) {
      logSecurityEvent({
        timestamp,
        userId: 'anonymous',
        action: 'DOWNLOAD_ATTEMPT',
        resource: fileName,
        ip: clientIp,
        status: 'DENIED',
      });
      throw new Error('Session invalide. Veuillez vous reconnecter.');
    }

    // ---------------------------------------------------------
    // ÉTAPE 2 : Vérification Achat
    // ---------------------------------------------------------
    const hasPaid = user.purchasedProductIds.includes(productId);

    if (!hasPaid) {
      logSecurityEvent({
        timestamp,
        userId: user.id,
        action: 'DOWNLOAD_ATTEMPT',
        resource: fileName,
        ip: clientIp,
        status: 'DENIED',
      });
      throw new Error('Accès refusé. Produit non acquis.');
    }

    // ---------------------------------------------------------
    // ÉTAPE 3 : Vérification Statut Ressource
    // ---------------------------------------------------------
    if (fileName.includes('draft')) {
      throw new Error('Ce document est en cours de validation.');
    }

    // ---------------------------------------------------------
    // ÉTAPE 4 : Génération du Lien Signé (Mock for Demo)
    // ---------------------------------------------------------
    const expiresInSeconds = 15 * 60;
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    const signature =
      Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

    // Use a standard public PDF for demo purposes so "Download" actually does something visible
    const signedUrl = `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?token=${signature}&user=${user.id}`;

    logSecurityEvent({
      timestamp,
      userId: user.id,
      action: 'GENERATE_SIGNED_URL',
      resource: fileName,
      ip: clientIp,
      status: 'SUCCESS',
    });

    return {
      success: true,
      url: signedUrl,
      expiresAt,
    };
  } catch (error) {
    console.error('Security Service Error:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};
