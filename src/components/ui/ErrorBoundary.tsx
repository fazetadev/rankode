import React from 'react';
import { AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react';
import { LEGACY_STORAGE_KEY, STORAGE_KEY } from '../../config';
import { translate } from '../../i18n/useT';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  confirmingReset: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      confirmingReset: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      errorMessage: error.message || 'Error desconocido',
    };
  }

  componentDidCatch(error: Error) {
    console.error('[rankode ErrorBoundary]', error);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetLocal = () => {
    if (!this.state.confirmingReset) {
      this.setState({ confirmingReset: true });
      return;
    }
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      window.localStorage.removeItem('rankode_accounts_v2');
    } catch {
      // Ignorar errores de almacenamiento
    }
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B] p-6 text-[#FAFAFA]">
        <div className="w-full max-w-md rounded-lg border border-[#27272A] bg-[#111113] p-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-base font-semibold text-[#FAFAFA]">
                {translate('es', 'errorBoundary.title')}
              </h1>
              <p className="text-xs text-[#A1A1AA]">
                {translate('es', 'errorBoundary.description')}
              </p>
            </div>
          </div>

          {this.state.errorMessage && (
            <pre className="mt-4 overflow-x-auto rounded-md border border-[#27272A] bg-[#09090B] p-3 font-mono text-xs text-red-300">
              {this.state.errorMessage}
            </pre>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={this.handleResetLocal}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-3 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>
                {this.state.confirmingReset
                  ? translate('es', 'errorBoundary.confirmReset')
                  : translate('es', 'errorBoundary.resetLocal')}
              </span>
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#8B5CF6] px-3 text-xs font-medium text-[#FAFAFA] transition-colors hover:bg-[#7C3AED]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{translate('es', 'errorBoundary.reload')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
