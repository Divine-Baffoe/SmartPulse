// src/components/dashboard/Settings.tsx
import React, { useState, useEffect } from 'react';
import { FaSave, FaPlus } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Modal from 'react-modal';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Bind Modal to app root
Modal.setAppElement('#root');

interface UserSettings {
    fullName: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    notifications: { dailyReports: boolean; stressAlerts: boolean };
}

interface User {
    id: number;
    name: string;
    companyId: number;
    role: string;
}

// Mock data (replace with API call)
const fetchMockSettings = (userId: number): Promise<UserSettings> =>
    new Promise((resolve) =>
        setTimeout(
            () =>
                resolve({
                    fullName: 'Maureen Semenhyia',
                    email: 'maureen@example.com',
                    countryCode: '+233',
                    phoneNumber: '123456789',
                    notifications: { dailyReports: true, stressAlerts: true },
                }),
            1000,
        ),
    );

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<UserSettings | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const user: User = { id: 1, name: 'Maureen Semenhyia', companyId: 1, role: 'admin' }; // Replace with auth context

    // Fetch settings with retry
    const fetchSettings = async (retries = 3): Promise<void> => {
        try {
            const data = await fetchMockSettings(user.id);
            setSettings(data);
            setFormData(data);
            setLoading(false);
        } catch (err) {
            if (retries > 0) {
                setTimeout(() => fetchSettings(retries - 1), 1000);
            } else {
                setError('Failed to load settings');
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchSettings();
        // eslint-disable-next-line
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Just update local state for now
            setSettings(formData);
        } catch (err) {
            setError('Failed to save settings');
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        // Just close modal for now
        setIsInviteModalOpen(false);
        setInviteEmail('');
    };

    if (loading) {
        return <div className="p-6 pt-20 text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 pt-20 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 pt-20">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 transition-opacity duration-300 ease-in-out">
                Settings
            </h2>
            <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                {/* Profile Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Full Name</label>
                            <input
                                type="text"
                                value={formData?.fullName || ''}
                                onChange={(e) => setFormData({ ...formData!, fullName: e.target.value })}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                                aria-label="Full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                value={formData?.email || ''}
                                onChange={(e) => setFormData({ ...formData!, email: e.target.value })}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                                aria-label="Email"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                            <PhoneInput
                                country={'gh'}
                                value={
                                    (formData?.countryCode
                                        ? formData.countryCode.replace('+', '')
                                        : '') + (formData?.phoneNumber || '')
                                }
                                onChange={(phone, country: any) =>
                                    setFormData({
                                        ...formData!,
                                        countryCode: `+${country.dialCode}`,
                                        phoneNumber: phone.slice(country.dialCode.length),
                                    })
                                }
                                inputClass="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-1"
                            data-tooltip-id="save-settings-tooltip"
                            data-tooltip-content="Save your profile settings"
                        >
                            <FaSave className="w-4 h-4" />
                            <span>Save</span>
                        </button>
                        <ReactTooltip id="save-settings-tooltip" className="z-50" />
                    </form>
                </div>

                {/* Notification Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Notifications</h3>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData?.notifications.dailyReports || false}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData!,
                                        notifications: { ...formData!.notifications, dailyReports: e.target.checked },
                                    })
                                }
                                className="mr-2"
                            />
                            Receive daily productivity reports
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData?.notifications.stressAlerts || false}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData!,
                                        notifications: { ...formData!.notifications, stressAlerts: e.target.checked },
                                    })
                                }
                                className="mr-2"
                            />
                            Receive stress alerts
                        </label>
                    </div>
                </div>

                {/* Admin: Invite Users */}
                {user.role === 'admin' && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Invite Users</h3>
                        <button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-1"
                            data-tooltip-id="invite-user-tooltip"
                            data-tooltip-content="Invite a new user to your company"
                        >
                            <FaPlus className="w-4 h-4" />
                            <span>Invite User</span>
                        </button>
                        <ReactTooltip id="invite-user-tooltip" className="z-50" />
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            <Modal
                isOpen={isInviteModalOpen}
                onRequestClose={() => setIsInviteModalOpen(false)}
                className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20 w-full"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h3 className="text-lg font-bold text-gray-700 mb-4">Invite User</h3>
                <form onSubmit={handleInvite}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                                aria-label="Invite email"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsInviteModalOpen(false)}
                            className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100 transition-colors duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition-colors duration-300"
                        >
                            Send Invite
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Settings;