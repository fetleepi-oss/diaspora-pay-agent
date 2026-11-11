import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'Unexpected error' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-[#0e1513] p-6">
          <div className="max-w-md w-full bg-white dark:bg-[#17211e] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-[#c94a38]">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              We hit an unexpected bump. Your cart and saved recipients are safe.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b6e4f] hover:bg-[#095a40] text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0b6e4f] focus:ring-offset-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reload app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
