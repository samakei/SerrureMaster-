import React from 'react';
import { ArrowLeft, Cookie, Shield, Settings, Info, RefreshCw, XCircle } from 'lucide-react';

interface CookiesPolicyProps {
  onBack: () => void;
  onReset: () => void;
}

export const CookiesPolicy: React.FC<CookiesPolicyProps> = ({ onBack, onReset }) => {
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
              <Cookie className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 m-0 uppercase">
                Politique de Gestion des Cookies
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Conformité CNIL & ePrivacy – Dernière mise à jour : 21/12/2025
              </p>
            </div>
          </div>

          <p className="text-lg text-slate-700 mb-8">
            <strong>SerrureMaster</strong> respecte votre vie privée. La présente politique vous
            informe de manière claire sur l’utilisation des cookies sur le site et sur vos droits.
          </p>

          {/* SECTION 1 */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-orange-600" />
              1. Qu’est-ce qu’un cookie ?
            </h3>
            <p className="mb-2">
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette,
              smartphone) lors de la consultation d’un site internet.
            </p>
            <p className="mb-2">Il permet notamment :</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>d’assurer le bon fonctionnement du site,</li>
              <li>de maintenir votre session connectée,</li>
              <li>de sécuriser les transactions.</li>
            </ul>
          </section>

          {/* SECTION 2 */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-orange-600" />
              2. Cookies utilisés sur SerrureMaster
            </h3>

            <h4 className="font-bold text-slate-800 mt-6 mb-3 text-lg">
              A. Cookies strictement nécessaires (obligatoires)
            </h4>
            <p className="mb-4 text-sm text-slate-600">
              Ces cookies sont indispensables au fonctionnement du site. Ils ne nécessitent aucun
              consentement préalable, conformément aux recommandations de la CNIL.
            </p>

            <div className="overflow-x-auto rounded-lg border border-slate-200 mb-4">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Cookie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Finalité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Durée
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200 text-sm">
                  <tr>
                    <td className="px-6 py-4 font-mono text-xs text-orange-600">
                      serrure_master_user
                    </td>
                    <td className="px-6 py-4">Authentification et accès à l’espace membre</td>
                    <td className="px-6 py-4">Session</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-xs text-orange-600">
                      serrure_master_consent
                    </td>
                    <td className="px-6 py-4">Sauvegarde de votre choix de consentement</td>
                    <td className="px-6 py-4">6 mois</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-xs text-orange-600">
                      __stripe_mid / __stripe_sid
                    </td>
                    <td className="px-6 py-4">Sécurisation des paiements (Stripe)</td>
                    <td className="px-6 py-4">12 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm bg-slate-100 p-3 rounded text-slate-700 font-medium flex items-center">
              <span className="mr-2">👉</span> Sans ces cookies, le site ne peut pas fonctionner
              correctement.
            </p>

            <h4 className="font-bold text-slate-800 mt-8 mb-3 text-lg">B. Cookies analytiques</h4>
            <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r">
              <p className="font-bold flex items-center mb-1 text-slate-700">
                <XCircle className="w-5 h-5 mr-2 text-slate-500" />
                Aucun cookie analytique n’est actuellement utilisé sur ce site.
              </p>
              <p className="text-sm text-slate-600 ml-7">
                SerrureMaster ne mesure pas l’audience et ne réalise aucun suivi statistique des
                visiteurs.
              </p>
            </div>

            <h4 className="font-bold text-slate-800 mt-8 mb-3 text-lg">C. Cookies marketing</h4>
            <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r">
              <p className="font-bold flex items-center mb-1 text-slate-700">
                <XCircle className="w-5 h-5 mr-2 text-slate-500" />
                Aucun cookie marketing ou publicitaire n’est utilisé.
              </p>
              <p className="text-sm text-slate-600 ml-7">
                Aucune donnée n’est transmise à des régies publicitaires ou plateformes de ciblage.
              </p>
            </div>
          </section>

          {/* SECTION 3 */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-orange-600" />
              3. Gestion de votre consentement
            </h3>
            <p className="mb-2">
              Lors de votre première visite, un bandeau d’information s’affiche afin de vous
              informer de l’utilisation des cookies.
            </p>
            <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 mb-4 text-sm font-medium">
              👉 Étant donné que seuls des cookies strictement nécessaires sont utilisés, aucun
              consentement n’est requis.
            </div>
            <p className="mb-4 text-sm text-slate-600">
              Si des cookies optionnels venaient à être ajoutés à l’avenir, vous seriez informé et
              pourriez : accepter, refuser, ou personnaliser vos choix. Vous pourrez modifier votre
              consentement à tout moment via un lien dédié.
            </p>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Modifier mes préférences</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Vous pouvez réouvrir le panneau de configuration à tout moment.
                  </p>
                </div>
                <button
                  onClick={onReset}
                  className="flex items-center bg-white hover:bg-slate-100 text-slate-700 font-bold py-2 px-4 border border-slate-300 rounded shadow-sm transition text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Gérer mes cookies
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 4 */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4">4. Paramétrage du navigateur</h3>
            <p className="mb-2">
              Vous pouvez également configurer votre navigateur pour bloquer ou supprimer les
              cookies :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 mb-4">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  Safari
                </a>
              </li>
            </ul>
            <p className="text-sm text-red-600 font-bold">
              ⚠️ Attention : bloquer les cookies essentiels peut empêcher l’accès à l’espace membre.
            </p>
          </section>

          {/* SECTION 5 */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-4">5. Contact</h3>
            <p>
              Pour toute question concernant les cookies ou vos données personnelles :
              <a
                href="mailto:contact@serruremaster.com"
                className="ml-1 text-orange-600 font-bold hover:underline"
              >
                contact@serruremaster.com
              </a>
            </p>
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
