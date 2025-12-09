import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-red-500/10 p-4 rounded-full mb-4">
            <AlertTriangle className="text-red-500" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Что-то пошло не так</h2>
          <p className="text-slate-400 mb-6 max-w-md">
            Произошла ошибка при загрузке этого компонента. Мы уже работаем над исправлением.
          </p>
          <button
            onClick={this.handleReload}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Обновить страницу
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-8 p-4 bg-slate-900 rounded-lg text-left w-full max-w-2xl overflow-auto">
              <p className="text-red-400 font-mono text-sm mb-2">{this.state.error.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}