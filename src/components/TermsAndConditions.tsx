import { FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Terms & Conditions</h1>
                    </div>
                    <p className="text-slate-600">Fantastic Finance</p>
                    <p className="text-sm text-slate-500 mt-2">
                        By accessing or using Fantastic Finance ("the website"), you agree to the following terms and conditions.
                    </p>
                </div>

                {/* Terms & Conditions Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="prose prose-slate max-w-none space-y-6">

                        {/* Section 1 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">1. Use of Website</h2>
                            <p className="text-slate-700">
                                You agree to use the website only for lawful purposes and in a manner that does not damage or impair the site.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">2. No Investment Advice</h2>
                            <p className="text-slate-700 font-semibold">
                                Fantastic Finance does not provide investment advice.
                            </p>
                            <p className="text-slate-700">
                                All information is for educational and informational use only.
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">3. Accuracy of Information</h2>
                            <p className="text-slate-700 mb-3">
                                We attempt to ensure accuracy but do not guarantee completeness, reliability, or correctness of:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 text-slate-700">
                                <li>Market data</li>
                                <li>Charts</li>
                                <li>News</li>
                                <li>Tools</li>
                                <li>Analysis</li>
                            </ul>
                            <p className="text-slate-700 mt-3">
                                Data may be delayed or sourced from third parties.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">4. Limitation of Liability</h2>
                            <p className="text-slate-700 mb-3">Fantastic Finance will not be liable for:</p>
                            <ul className="list-disc pl-6 space-y-1 text-slate-700">
                                <li>Any financial loss</li>
                                <li>Any damages arising from the use of the website</li>
                                <li>Errors, data delays, or website downtime</li>
                            </ul>
                        </div>

                        {/* Section 5 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">5. User Responsibilities</h2>
                            <p className="text-slate-700 mb-3">Users must:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-700">
                                <li>Evaluate information independently</li>
                                <li>Consult a registered advisor before making investment decisions</li>
                                <li>Not misuse or hack any part of the website</li>
                            </ul>
                        </div>

                        {/* Section 6 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">6. Intellectual Property</h2>
                            <p className="text-slate-700 mb-2">
                                All logos, brand assets, UI elements, and content belong to Fantastic Finance unless stated otherwise.
                            </p>
                            <p className="text-slate-700 font-semibold">
                                You may not reproduce or copy content without permission.
                            </p>
                        </div>

                        {/* Section 7 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">7. Termination</h2>
                            <p className="text-slate-700">
                                We reserve the right to restrict or terminate access for misuse, abuse, or violation of terms.
                            </p>
                        </div>

                        {/* Section 8 */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">8. Governing Law</h2>
                            <p className="text-slate-700">
                                These terms are governed by the laws of India.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Important Notice Box */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
                    <div className="flex gap-3">
                        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-yellow-900 mb-2">Agreement to Terms</h3>
                            <p className="text-sm text-yellow-800">
                                By using Fantastic Finance, you acknowledge that you have read, understood, and agree to be bound
                                by these Terms & Conditions. If you do not agree, please discontinue use of the website immediately.
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
