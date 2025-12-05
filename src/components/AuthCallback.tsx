import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Authenticating...');

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const storedState = localStorage.getItem('oauth_state');

            // Validate state to prevent CSRF
            if (!state || state !== storedState) {
                setStatus('error');
                setMessage('Invalid state parameter. Possible CSRF attack.');
                return;
            }

            if (!code) {
                setStatus('error');
                setMessage('Authorization code not found.');
                return;
            }

            try {
                await authService.exchangeCodeForToken(code);
                setStatus('success');
                setMessage('Successfully authenticated! Redirecting...');

                // Redirect to home after 2 seconds
                setTimeout(() => {
                    navigate('/');
                    window.location.reload(); // Reload to reinitialize WebSocket with new token
                }, 2000);
            } catch (error) {
                console.error('Token exchange failed:', error);
                setStatus('error');
                setMessage('Failed to exchange authorization code. Please try again.');
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 max-w-md w-full">
                <div className="flex flex-col items-center text-center">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Authenticating
                            </h2>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Success!
                            </h2>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="w-16 h-16 text-red-600 mb-4" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Authentication Failed
                            </h2>
                        </>
                    )}

                    <p className="text-slate-600 dark:text-slate-400">{message}</p>

                    {status === 'error' && (
                        <button
                            onClick={() => navigate('/')}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Return to Home
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
