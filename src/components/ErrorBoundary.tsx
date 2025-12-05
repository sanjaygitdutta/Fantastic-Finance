import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <button
                        onClick={this.handleRetry}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh Page
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-left text-xs text-red-600 dark:text-red-400 overflow-auto max-w-full">
                            {this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
