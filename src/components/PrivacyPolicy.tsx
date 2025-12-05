import { Shield, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
                    </div>
                    <p className="text-slate-600">Fantastic Finance</p>
                </div>

                {/* Privacy Policy Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="prose prose-slate max-w-none space-y-6">
                        <p className="text-slate-700 leading-relaxed">
                            Fantastic Finance ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy
                            explains how we collect, use, store, and safeguard your information.
                        </p>

                        {/* Section 1 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
                            <p className="text-slate-700 mb-3">We may collect the following information:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-700">
                                <li><strong>Personal Information:</strong> Name, email address (only if you submit forms).</li>
                                <li><strong>Non-Personal Information:</strong> Browser type, device info, IP address.</li>
                                <li><strong>Cookies & Analytics Data:</strong> For website improvement.</li>
                            </ul>
                            <p className="text-slate-700 mt-3 font-semibold">
                                We do not collect financial data, bank information, or Aadhaar details.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
                            <p className="text-slate-700 mb-3">We use collected data to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-700">
                                <li>Improve website performance and user experience</li>
                                <li>Send newsletters (only with your permission)</li>
                                <li>Analyse traffic patterns</li>
                                <li>Maintain website security</li>
                            </ul>
                            <p className="text-slate-700 mt-3 font-semibold">
                                We never sell or share your data with third parties for marketing.
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">3. Cookies</h2>
                            <p className="text-slate-700 mb-3">We may use cookies to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-700">
                                <li>Save preferences</li>
                                <li>Track usage patterns</li>
                                <li>Improve loading speed</li>
                            </ul>
                            <p className="text-slate-700 mt-3">
                                You may disable cookies through your browser settings.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">4. Data Security</h2>
                            <p className="text-slate-700">
                                We implement reasonable technical safeguards to protect your data. However, no system is 100% secure,
                                and we cannot guarantee absolute security.
                            </p>
                        </div>

                        {/* Section 5 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">5. Third-Party Links</h2>
                            <p className="text-slate-700">
                                Our website may contain links to third-party websites. We are not responsible for their content
                                or privacy policies.
                            </p>
                        </div>

                        {/* Section 6 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">6. Changes to Policy</h2>
                            <p className="text-slate-700">
                                We may update this Privacy Policy anytime. Updates will be posted on this page.
                            </p>
                        </div>

                        {/* Section 7 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">7. Contact Us</h2>
                            <p className="text-slate-700 mb-3">For privacy-related questions, email us at:</p>
                            <a
                                href="mailto:fantasticfinancialattherate@gmail.com"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Mail className="w-4 h-4" />
                                fantasticfinancialattherate@gmail.com
                            </a>
                        </div>
                    </div>
                </div>

                {/* Important Notice Box */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                    <div className="flex gap-3">
                        <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">Your Privacy Matters</h3>
                            <p className="text-sm text-blue-800">
                                We are committed to transparency and protecting your personal information. If you have any
                                questions or concerns about how we handle your data, please don't hesitate to contact us.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
