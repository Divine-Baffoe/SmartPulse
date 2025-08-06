// src/components/dashboard/AdminProfile.tsx
import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaSave } from 'react-icons/fa';

interface AdminSettings {
  name: string;
  email: string;
  company: string;
  contact: string;
  countryCode: string;
  avatarUrl?: string;
}


const AdminProfile: React.FC = () => {
  const [formData, setFormData] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  console.log ('AdminProfile rendered', formData);
  const fetchAdminSettings = async () => {
   
    try {
      const res = await fetch('http://localhost:3000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setFormData(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load admin settings');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    const formDataImage = new FormData();
    formDataImage.append('image', file);

    const res = await fetch('http://localhost:3000/api/user/upload-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formDataImage,
    });

    const data = await res.json();
    if (res.ok && data.imageUrl) {
      const updated = { ...formData, avatarUrl: data.imageUrl };
      setFormData(updated);

      // Save avatar to backend
      await fetch('http://localhost:3000/api/user/profile-update', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updated),
      });
    } else {
      alert('Failed to upload image');
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      const res = await fetch('http://localhost:3000/api/user/update-settings', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        alert('Failed to save settings');
        return;
      }
      alert('✅ Admin settings saved successfully!');
    } catch {
      alert('Error saving settings');
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-10 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">🛠️ Admin Profile Settings</h2>

      <div className="flex flex-col items-center space-y-4">
        {/* Avatar */}
        <div className="flex flex-col items-center">
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

        {/* Form Fields */}
        <div className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">👤 Full Name</label>
            <input
              type="text"
              value={formData?.name || ''}
              onChange={(e) => setFormData({ ...formData!, name: e.target.value })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">📧 Email</label>
            <input
              type="email"
              value={formData?.email || ''}
              onChange={(e) => setFormData({ ...formData!, email: e.target.value })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">🏢 Company</label>
            <input
              type="text"
              value={formData?.company || ''}
              onChange={(e) => setFormData({ ...formData!, company: e.target.value })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">📞 Contact</label>
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
              inputClass="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-4 bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700 transition duration-300 flex items-center space-x-2"
        >
          <FaSave />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;