import React from 'react';
import { ArrowLeft, ShieldCheck, Scale } from 'lucide-react';

export const CGV: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
               <Scale className="w-8 h-8 text-orange-500" />
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 m-0">Conditions Générales de Vente</h1>
                <p className="text-slate-500 text-sm mt-1">Dernière mise à jour : 21/12/2025</p>
            </div>
          </div>

          {/* ARTICLE 1 */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-l-4 border-orange-500 pl-3 mb-4">
                1. Objet et Identification
            </h3>
            <p>
                Les présentes Conditions Générales de Vente (CGV) régissent la vente de contenus numériques par <strong>SerrureMaster</strong> (ci-après « le Vendeur ») à toute personne physique ou morale (ci-après « le Client »).
            </p>
            <p>
                Les CGV s’appliquent à toute commande passée sur le site SerrureMaster, sans restriction ni réserve.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm grid gap-2">
                <div className="flex items-center"><span className="font-bold w-48">Dénomination commerciale :</span> SerrureMaster</div>
                <div className="flex items-center"><span className="font-bold w-48">Activité :</span> Vente de plans d’action digitaux en serrurerie</div>
                <div className="flex items-center"><span className="font-bold w-48">Email de contact :</span> <a href="mailto:contact@serruremaster.com" className="text-orange-600 hover:underline">contact@serruremaster.com</a></div>
                <div className="flex items-center"><span className="font-bold w-48">Hébergement du site :</span> Vercel Inc.</div>
            </div>
          </section>

          {/* ARTICLE 2 */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-l-4 border-orange-500 pl-3 mb-4">
                2. Description des Produits
            </h3>
            <p>
                SerrureMaster commercialise des Plans d’Action digitaux premium destinés à accompagner les Clients dans la compréhension et la gestion de problématiques courantes de serrurerie (porte claquée, clé cassée, remplacement de cylindre, sécurisation, etc.).
            </p>
            <p>Chaque Plan d’Action peut inclure :</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>des vidéos pédagogiques accessibles en streaming,</li>
                <li>un ou plusieurs guides PDF experts,</li>
                <li>des checklists ou supports complémentaires,</li>
                <li>et, selon l’offre, une assistance à distance (ex. WhatsApp).</li>
            </ul>
            
            <div className="mt-4 bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-start">
                <ShieldCheck className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                    <strong>⚠️ Information importante :</strong><br/>
                    Certains supports, notamment les PDF, peuvent être mis à disposition progressivement, après validation professionnelle par SerrureMaster. L’achat d’un Plan d’Action donne accès à l’espace membre correspondant, indépendamment de la disponibilité immédiate de l’ensemble des supports.
                </div>
            </div>
          </section>

          {/* ARTICLE 3 */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-l-4 border-orange-500 pl-3 mb-4">
                3. Prix
            </h3>
            <p>
                Les prix sont indiqués en euros (€), toutes taxes comprises (TTC).<br/>
                Le prix standard d’un Plan d’Action est de <strong>100,00 € TTC</strong>, sauf indication contraire.
            </p>
            <p>
                SerrureMaster se réserve le droit de modifier ses prix à tout moment. Le prix facturé est celui en vigueur au moment de la validation de la commande par le Client.
            </p>
          </section>

          {/* ARTICLE 4 */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-l-4 border-orange-500 pl-3 mb-4">
                4. Paiement et Sécurisation
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Le paiement est exigible immédiatement lors de la commande.</li>
                <li>Les règlements s’effectuent exclusivement par carte bancaire via le prestataire de paiement sécurisé <strong>Stripe</strong>.</li>
                <li>SerrureMaster ne conserve aucune donnée bancaire sensible du Client.</li>
            </ul>
          </section>

          {/* ARTICLE 5 */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-l-4 border-orange-500 pl-3 mb-4">
                5. Livraison et Accès aux Contenus
            </h3>
            <p>La livraison est entièrement dématérialisée.</p>
            <p>Après validation du paiement, le Client obtient un accès personnel à son Espace Membre sécurisé, lui permettant :</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>de consulter les contenus disponibles,</li>
                <li>de suivre l’évolution du Plan d’Action,</li>
                <li>de télécharger les PDF lorsqu’ils sont publiés.</li>
            </ul>
            <p className="mt-2 text-sm italic text-slate-500">
                Si un support est en cours de validation, le message suivant sera affiché :<br/>
                « Le guide est actuellement en cours de validation et sera mis à disposition prochainement. »<br/>
                Cette situation ne constitue en aucun cas un manquement contractuel.
            </p>
          </section>

          {/* ARTICLE 6 */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-l-4 border-orange-500 pl-3 mb-4">
                6. Droit de Rétractation – Produits Numériques
            </h3>
            <p>
                Conformément à l’article <strong>L221-28 13° du Code de la consommation</strong>, le droit de rétractation ne peut être exercé pour les contenus numériques fournis sans support matériel, lorsque l’exécution a commencé après accord préalable exprès du consommateur.
            </p>
            <p className="font-bold mt-2">En validant sa commande, le Client reconnaît :</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>la nature numérique du produit,</li>
                <li>que l’accès aux contenus débute immédiatement,</li>
                <li>que certains contenus peuvent être accessibles de manière progressive.</li>
            </ul>
            <p className="mt-2 bg-slate-100 p-3 rounded font-medium text-slate-900">
                En conséquence, le Client renonce expressément à son droit de rétractation.
            </p>
          </section>

          {/* ARTICLE 7 */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-l-4 border-orange-500 pl-3 mb-4">
                7. Responsabilité et Utilisation Légale
            </h3>
            <p>
                Les Plans d’Action fournis par SerrureMaster ont une vocation strictement pédagogique et informative.
                Le Vendeur est tenu à une obligation de moyens, et non de résultat.
            </p>
            <p>Le Client demeure seul responsable :</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>de l’interprétation des informations,</li>
                <li>de leur mise en œuvre,</li>
                <li>et de la décision de poursuivre ou d’interrompre toute action.</li>
            </ul>
            <div className="mt-4 p-4 border-l-4 border-red-500 bg-red-50 text-red-900 text-sm">
                <strong>Le Client s’engage à :</strong><br/>
                - intervenir uniquement sur des serrures dont il est le propriétaire légitime ou le locataire autorisé,<br/>
                - respecter les consignes de sécurité et les indications « STOP » présentes dans les contenus.
            </div>
            <p className="mt-4">
                SerrureMaster décline toute responsabilité en cas de dommages matériels résultant d’une mauvaise manipulation, d’utilisation illégale des techniques enseignées, d’échec de la méthode, ou de poursuite d’une action malgré un avertissement explicite.
            </p>
          </section>

          {/* ARTICLE 8 */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-l-4 border-orange-500 pl-3 mb-4">
                8. Propriété Intellectuelle
            </h3>
            <p>
                L’ensemble des contenus (textes, vidéos, PDF, images, supports) est la propriété exclusive de SerrureMaster.
                Toute reproduction, diffusion, partage de compte ou redistribution, totale ou partielle, est strictement interdite.
            </p>
            <p>
                Les accès et liens de téléchargement sont sécurisés, personnels et tracés. Toute tentative de contournement des systèmes de protection pourra entraîner la suspension immédiate de l’accès sans remboursement, et, le cas échéant, des poursuites judiciaires.
            </p>
          </section>

          {/* ARTICLE 9 & 10 */}
          <section className="mb-10 grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-l-4 border-orange-500 pl-3 mb-4">
                    9. Données Personnelles
                </h3>
                <p className="text-sm">
                    Les données personnelles collectées (nom, email, historique d’achat) sont strictement nécessaires à l’exécution du contrat. Elles ne sont ni revendues ni cédées à des tiers.
                    Conformément au RGPD, le Client dispose d’un droit d’accès, de rectification et de suppression de ses données sur simple demande à : <span className="font-mono text-slate-600">contact@serruremaster.com</span>
                </p>
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-l-4 border-orange-500 pl-3 mb-4">
                    10. Litiges
                </h3>
                <p className="text-sm">
                    Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité. À défaut d’accord amiable, les tribunaux français seront seuls compétents.
                </p>
            </div>
          </section>

          <div className="bg-slate-900 text-slate-300 p-6 rounded-xl text-center">
             <h4 className="text-white font-bold text-lg mb-2">11. Acceptation des CGV</h4>
             <p className="text-sm">La validation de la commande implique l’acceptation pleine et entière des présentes Conditions Générales de Vente par le Client.</p>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition shadow-lg"
          >
            J'ai lu et j'accepte
          </button>
        </div>
      </div>
    </div>
  );
};