import { useState } from 'react';
import { Shield, User, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { adminLogin } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const cleanUsername = username.trim();
        const cleanPassword = password.trim();

        console.log('Attempting login with:', { username: cleanUsername, passwordLength: cleanPassword.length });

        // Simulate network delay for better UX
        setTimeout(() => {
            const success = adminLogin(cleanUsername, cleanPassword);

            if (success) {
                navigate('/admin/dashboard');
            } else {
                console.error('Login failed for:', cleanUsername);
                setError('Invalid credentials. Please try again.');
                setPassword('');
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                    <p className="text-blue-200">Fantastic Finance Administration</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Sign In</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition ${isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            Admin access only. Unauthorized access is prohibited.
                        </p>
                    </div>
                </div>

                {/* Demo Credentials (Remove in production) */}
                <div className="mt-4 p-4 bg-blue-900/30 backdrop-blur-sm rounded-lg border border-blue-400/30">
                    <p className="text-xs text-blue-200 text-center">
                        <strong>Demo Credentials:</strong> admin / admin123
                    </p>
                </div>
            </div>
        </div>
    );
}
