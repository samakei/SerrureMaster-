import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isConfigError =
        this.state.error?.message?.includes('Configuration Supabase manquante') ||
        this.state.error?.message?.includes('VITE_SUPABASE');

      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-slate-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {isConfigError ? 'Configuration Requise' : 'Erreur d\'Application'}
                </h1>
                <p className="text-slate-600">
                  {isConfigError
                    ? 'L\'application nécessite une configuration'
                    : 'Une erreur inattendue s\'est produite'}
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-red-900 mb-2">Message d'erreur :</h2>
              <p className="text-red-800 text-sm font-mono break-words">
                {this.state.error?.message}
              </p>
            </div>

            {isConfigError && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h2 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Comment résoudre ce problème :
                </h2>
                <ol className="space-y-3 text-sm text-slate-700">
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600 min-w-[24px]">1.</span>
                    <div>
                      <p className="font-medium mb-1">Créez un fichier <code className="bg-slate-200 px-2 py-1 rounded">.env.local</code> à la racine du projet</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600 min-w-[24px]">2.</span>
                    <div>
                      <p className="font-medium mb-1">Ajoutez vos variables d'environnement :</p>
                      <pre className="bg-slate-800 text-green-400 p-3 rounded mt-2 text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-ici
VITE_STRIPE_PUBLIC_KEY=pk_test_votre-cle-ici`}
                      </pre>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600 min-w-[24px]">3.</span>
                    <div>
                      <p className="font-medium">Obtenez vos clés depuis :</p>
                      <ul className="mt-2 space-y-1 ml-4">
                        <li className="text-xs">• <strong>Supabase:</strong> Dashboard → Settings → API</li>
                        <li className="text-xs">• <strong>Stripe:</strong> Dashboard → Developers → API keys</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600 min-w-[24px]">4.</span>
                    <div>
                      <p className="font-medium">Redémarrez le serveur de développement :</p>
                      <pre className="bg-slate-800 text-green-400 p-2 rounded mt-2 text-xs">
npm run dev
                      </pre>
                    </div>
                  </li>
                </ol>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Recharger la page
              </button>
              <a
                href="https://github.com/samakei/SerrureMaster-"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Documentation
              </a>
            </div>

            {!isConfigError && import.meta.env.MODE === 'development' && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-900 font-medium">
                  Détails techniques (développeurs)
                </summary>
                <div className="mt-3 bg-slate-100 rounded-lg p-4">
                  <pre className="text-xs text-slate-800 overflow-x-auto">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
