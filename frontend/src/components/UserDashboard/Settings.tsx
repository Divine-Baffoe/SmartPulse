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
    company: string;
    contact: string;
    notifications: { dailyReports: boolean; stressAlerts: boolean };
    avatarUrl?: string; // Optional profile image URL
}

interface User {
    id: number;
    name: string;
    companyId: number;
    role: string;
    avatarUrl?: string; // Optional profile image URL
}

const Settings: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<UserSettings | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    
     //Handle image upload
   // 🖼️ Handle image upload and persist avatar
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    const formDataImage = new FormData();
    formDataImage.append('image', file);

    try {
      const res = await fetch('http://localhost:3000/api/employees/upload-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataImage,
      });

      const data = await res.json();
      if (res.ok && data.imageUrl) {
        const updatedSettings = { ...formData, avatarUrl: data.imageUrl };

        // Save avatar to backend
        const saveRes = await fetch('http://localhost:3000/api/employees/update-settings', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSettings),
        });

        if (!saveRes.ok) {
          alert('Failed to save avatar');
          return;
        }

        // Update local state and localStorage
        setFormData(updatedSettings);
        const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
        const mergedUser = { ...existingUser, ...updatedSettings };
        localStorage.setItem('user', JSON.stringify(mergedUser));
      } else {
        alert('Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image');
    }
  };


    // Fetch settings with retry
    const fetchSettings = async (retries = 3): Promise<void> => {
        try {
            const res = await fetch('http://localhost:3000/api/employees/settings', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                setError('Failed to load settings');
                setLoading(false);
                return;
                }
            const data = await res.json();
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

    const handleSave = async () => {
        if (!formData) return;
    try {
        const res = await fetch('http://localhost:3000/api/employees/update-settings', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (!res.ok) {
            setError('Failed to save settings');
            return;
        }
        const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
        const mergedUser = { ...existingUser, ...formData };

         localStorage.setItem('user', JSON.stringify(mergedUser));
        alert('✅ Settings saved successfully');
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
        <div className="p-6 pt-2">
            
            <div className="bg-white mt-4 p-8 rounded-lg shadow-lg space-y-6">
                {/* Profile Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className='flex flex-col items-center'>
                        <label className="block text-sm font-medium items-center text-gray-600">Profile Image</label>
                        <img
                            src={formData?.avatarUrl || '/default-avatar.png'}
                            alt="Admin Avatar"
                            className="w-24 h-24 rounded-full object-cover border-4 border-cyan-400"
                        />
                        <h2 className="mt-2 text-lg font-semibold text-blue-700 text-center">
                           🌟 Make it yours! <br />
                           Upload a profile image to personalize your dashboard ✨
                        </h2>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mt-2 text-sm"
                        />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">👤 Full Name</label>
                            <input
                                type="text"
                                value={formData?.fullName || ''}
                                onChange={(e) => setFormData({ ...formData!, fullName: e.target.value })}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                                aria-label="Full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">📧 Email</label>
                            <input
                                type="email"
                                value={formData?.email || ''}
                                onChange={(e) => setFormData({ ...formData!, email: e.target.value })}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                                aria-label="Email"
                            />
                        </div>
                        <div>   
                            <label className="block text-sm font-medium text-gray-600">🏢 Company</label>
                            <input
                                type="text"
                                value={formData?.company || ''}
                                onChange={(e) => setFormData({ ...formData!, company: e.target.value })}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                                aria-label="Company"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">📞 Contact</label>
                            <PhoneInput
                                country={'gh'}
                                value={formData?.contact || ''}

                                onChange={(phone, country: any) => {
                                    setFormData({
                                        ...formData!,
                                        countryCode: `+${country.dialCode}`,
                                        contact: phone,
                                    });
                                    }}
                                inputClass="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                        <button
                            onClick={handleSave}
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
                {(() => {
                    // Example: get user from localStorage or set a default user
                    const user: User = JSON.parse(localStorage.getItem('user') || '{"id":0,"name":"","companyId":0,"role":""}');
                    return user.role === 'admin' && (
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
                    );
                })()}
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