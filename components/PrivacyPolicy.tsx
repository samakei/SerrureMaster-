import React from 'react';
import { ArrowLeft, Lock, Database, Eye, Server, Mail, ShieldCheck, Clock, Share2, Scale, Cookie } from 'lucide-react';

export const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-orange-600 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </button>

        <div className="prose prose-slate max-w-none">
          <div className="flex items-center mb-6 border-b border-slate-200 pb-6">
            <div className="bg-slate-900 p-3 rounded-xl mr-4">
               <Lock className="w-8 h-8 text-orange-500" />
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 m-0 uppercase">Politique de Confidentialité</h1>
                <p className="text-slate-500 text-sm mt-1">Mise en conformité RGPD – Dernière mise à jour : 21/12/2025</p>
            </div>
          </div>

          <p className="text-lg text-slate-700 mb-8">
            Chez <strong>SerrureMaster</strong>, la protection de vos données personnelles est une priorité.
            La présente politique explique de manière transparente comment vos données sont collectées, utilisées et protégées.
          </p>

          {/* SECTION 1 */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-orange-600" />
              1. Responsable du Traitement
            </h3>
            <p className="mb-4">
              Les données personnelles sont traitées par SerrureMaster, éditeur du site et responsable du traitement.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm space-y-2">
               <div className="flex items-center">
                  <span className="w-6 text-xl">📧</span>
                  <span className="font-bold mr-2">Email de contact :</span> 
                  <a href="mailto:contact@serruremaster.com" className="text-orange-600 hover:underline">contact@serruremaster.com</a>
               </div>
               <div className="flex items-center">
                  <span className="w-6 text-xl">📧</span>
                  <span className="font-bold mr-2">Délégué à la protection des données (DPO) :</span> 
                  <a href="mailto:dpo@serruremaster.com" className="text-orange-600 hover:underline">dpo@serruremaster.com</a>
               </div>
            </div>
          </section>

          {/* SECTION 2 */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-orange-600" />
              2. Données Collectées
            </h3>
            <p className="mb-2">Dans le cadre de l’utilisation du site et des services, nous pouvons collecter les données suivantes :</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 mb-4">
              <li><strong>Données d’identité :</strong> nom, prénom, adresse email</li>
              <li><strong>Données de transaction :</strong> historique des achats, identifiants de transaction Stripe</li>
              <li><strong>Données techniques et de sécurité :</strong> adresse IP, logs de connexion, type de navigateur, horodatage des accès aux contenus sécurisés</li>
            </ul>
            <div className="p-3 bg-orange-50 text-orange-800 text-sm border-l-4 border-orange-500 rounded-r">
              <strong>⚠️ Important :</strong> SerrureMaster ne stocke aucune donnée bancaire complète.
            </div>
          </section>

          {/* SECTION 3 */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-orange-600" />
              3. Finalités du Traitement
            </h3>
            <p className="mb-2">Les données sont traitées pour les finalités suivantes :</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 mb-4">
              <li>Exécution du contrat, Accès à l’espace membre, Livraison des contenus achetés</li>
              <li>Support client (Réponse aux demandes via email ou WhatsApp)</li>
              <li>Obligations légales (Gestion comptable et facturation)</li>
              <li><strong>Sécurité et protection des contenus (intérêt légitime)</strong></li>
            </ul>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
               <p className="text-sm font-bold text-slate-800 mb-2">Protection Anti-Piratage :</p>
               <p className="text-sm text-slate-600 mb-2">
                 Dans un objectif exclusif de lutte contre le piratage et la diffusion non autorisée, certaines données techniques (ID utilisateur, adresse IP) peuvent être utilisées pour :
               </p>
               <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm mb-3">
                 <li>sécuriser les accès,</li>
                 <li>tracer les téléchargements,</li>
                 <li>apposer des marquages numériques discrets sur les contenus.</li>
               </ul>
               <p className="text-xs italic text-slate-500 border-t border-slate-200 pt-2">
                 👉 Ces traitements sont proportionnés, non intrusifs, et ne visent en aucun cas à surveiller le comportement des utilisateurs.
               </p>
            </div>
          </section>

          {/* SECTION 4 */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              4. Durée de Conservation
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li><strong>Données de compte actif :</strong> durée d’utilisation du service</li>
              <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
              <li><strong>Logs de sécurité :</strong> 12 mois maximum</li>
            </ul>
          </section>

          {/* SECTION 5 */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Share2 className="w-5 h-5 mr-2 text-orange-600" />
              5. Partage des Données
            </h3>
            <p className="mb-2">Les données sont strictement destinées à SerrureMaster.</p>
            <p className="mb-2">Elles peuvent être transmises uniquement à des sous-traitants techniques nécessaires :</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 mb-4">
              <li>Stripe (paiement sécurisé)</li>
              <li>Vercel / AWS / Supabase (hébergement et stockage)</li>
            </ul>
            <p className="font-medium text-slate-900">
               Aucune donnée n’est vendue ou cédée à des tiers publicitaires.
            </p>
          </section>

          {/* SECTION 6 */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Scale className="w-5 h-5 mr-2 text-orange-600" />
              6. Vos Droits (RGPD)
            </h3>
            <p className="mb-2">Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 mb-4">
              <li>droit d’accès</li>
              <li>droit de rectification</li>
              <li>droit d’effacement</li>
              <li>droit à la portabilité</li>
              <li>droit d’opposition, notamment aux traitements fondés sur l’intérêt légitime</li>
            </ul>
            <div className="bg-slate-100 p-4 rounded-lg">
               <p className="mb-2 text-sm">Vous pouvez exercer vos droits en écrivant à :</p>
               <a href="mailto:contact@serruremaster.com" className="text-orange-600 font-bold hover:underline">contact@serruremaster.com</a>
               <p className="mt-2 text-xs text-slate-500">Vous pouvez également introduire une réclamation auprès de la CNIL.</p>
            </div>
          </section>

          {/* SECTION 7 */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Cookie className="w-5 h-5 mr-2 text-orange-600" />
              7. Cookies
            </h3>
            <p className="mb-4">
               Le site utilise uniquement des cookies techniques strictement nécessaires au fonctionnement de l’espace membre (authentification, maintien de session).
            </p>
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
               <p className="text-sm text-slate-700 font-medium">
                  👉 Ces cookies ne nécessitent pas de consentement préalable, conformément à la réglementation en vigueur.
               </p>
               <p className="text-sm text-slate-600 mt-1">
                  Aucun cookie publicitaire ou de suivi tiers n’est utilisé.
               </p>
            </div>
          </section>

        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition"
          >
            Retour au site
          </button>
        </div>
      </div>
    </div>
  );
};