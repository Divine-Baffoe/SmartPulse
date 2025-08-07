import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaUserPlus } from 'react-icons/fa';



interface Employee {
  id: number;
  name: string;
  avatarUrl?: string; // Google account image URL
}

const Assign: React.FC = () => {
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    projectName: '',
    projectDescription: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const adminData = JSON.parse(localStorage.getItem('user') || '{}');
  const currentCompanyId = adminData.companyId;

  const handleAssignClick = (e: React.FormEvent) => {
  e.preventDefault();
  setShowPreviewModal(true); // Show preview first
};

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/user/employees?companyId=${currentCompanyId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setEmployeeList(Array.isArray(data) ? data : []);
      } catch {
        setEmployeeList([]);
      }
    };

    fetchEmployees();
  }, [currentCompanyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId: Number(formData.employeeId),
        projectName: formData.projectName,
        projectDescription: formData.projectDescription,
        dueDate: formData.dueDate,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert('Failed to assign project');
      return;
    }

    alert('Project assigned successfully');
    navigate('/admin/dashboard/assign-projects'); // or wherever you want to redirect
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 mb-10 bg-gradient-to-br from-indigo-200 to-pink-200 rounded-lg shadow-xl">
      <div className="flex items-center mb-6">
        <FaClipboardList className="text-primary text-3xl mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Assign New Project</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="employeeId" className="block text-sm font-bold text-black">👤 Employee</label>
          <select
            name="employeeId"
            id="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary focus:outline-none"
          >
            <option value="">Select employee</option>
            {employeeList.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="projectName" className="block text-sm font-bold text-black">📌 Project Name</label>
          <input
            type="text"
            name="projectName"
            id="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="projectDescription" className="block text-sm font-bold text-black">📝 Project Description</label>
          <textarea
            name="projectDescription"
            id="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-black">📅 Due Date</label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:outline-none"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleAssignClick}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            {loading ? 'Assigning...' : 'Assign Project'}
          </button>
        </div>
      </form>
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md border-l-4 border-primary animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaUserPlus className="text-primary mr-2" />
                Confirm Project Assignment
            </h3>

            <div className="space-y-3 text-gray-700">
                <div>
                <span className="font-semibold text-blue-600">Employee:</span>{' '}
                {employeeList.find(emp => emp.id === Number(formData.employeeId))?.name || '—'}
                </div>
                <div>
                <span className="font-semibold text-blue-600">Project Name:</span>{' '}
                {formData.projectName}
                </div>
                <div>
                <span className="font-semibold text-blue-600">Description:</span>
                <p className="mt-1 text-sm text-gray-600 bg-blue-50 p-2 rounded">{formData.projectDescription}</p>
                </div>
                <div>
                <span className="font-semibold text-blue-600">Due Date:</span>{' '}
                {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : '—'}
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
                >
                Cancel
                </button>
                <button
                onClick={handleSubmit} // Your actual submit logic
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark focus:outline-none"
                >
                Confirm & Submit
                </button>
            </div>
            </div>
        </div>
        )}

    </div>
  );
};

export default Assign;