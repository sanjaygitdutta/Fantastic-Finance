import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { User, Mail, Lock, CreditCard, Shield, Camera } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        location: ''
    });

    // Load user metadata when component mounts or user changes
    useEffect(() => {
        if (user?.user_metadata) {
            setFormData({
                full_name: user.user_metadata.full_name || '',
                phone: user.user_metadata.phone || '',
                location: user.user_metadata.location || ''
            });
        }
    }, [user]);

    const handleSaveChanges = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        setIsSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: formData.full_name,
                    phone: formData.phone,
                    location: formData.location
                }
            });

            if (error) throw error;

            setIsEditing(false);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                    <p className="text-slate-500">Manage your account information and subscription</p>
                </div>
                <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition">
                                <Camera className="w-4 h-4 text-slate-600" />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">{formData.full_name || 'User'}</h2>
                        <p className="text-slate-500 text-sm mb-4">{user?.email}</p>
                        <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified Investor
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Account Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Member Since</span>
                                <span className="font-medium text-slate-900">Dec 2024</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Plan</span>
                                <span className="font-medium text-blue-600">Pro Trader</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Next Billing</span>
                                <span className="font-medium text-slate-900">Jan 1, 2025</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Personal Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Personal Information
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        defaultValue={user?.email || ''}
                                        disabled
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Enter your phone number"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Enter your location"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-blue-600" />
                                Security
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <p className="font-medium text-slate-900">Password</p>
                                    <p className="text-sm text-slate-500">Last changed 3 months ago</p>
                                </div>
                                <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium text-sm">
                                    Change Password
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                                    <p className="text-sm text-slate-500">Add an extra layer of security</p>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                                    Enable 2FA
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Subscription */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                Subscription
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="font-medium text-slate-900">Pro Trader Plan</p>
                                    <p className="text-sm text-slate-500">₹199 / month</p>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">ACTIVE</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <p className="text-xs text-slate-500 text-right">21 days remaining</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
