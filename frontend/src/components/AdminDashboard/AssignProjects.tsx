// src/components/AdminDashboard/AssignProjects.tsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaCheckCircle, FaLink } from 'react-icons/fa';
import Modal from 'react-modal';
import { Tooltip as ReactTooltip } from 'react-tooltip';

Modal.setAppElement('#root');

interface Project {
  id: number;
  employeeName: string;
  projectName: string;
  githubLink?: string;
  status: 'assigned' | 'completed';
}

const AssignProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState<{ employeeId: string; projectName: string }>({ employeeId: '', projectName: '' });
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const adminData = JSON.parse(localStorage.getItem('user') || '{}');
  const currentCompanyId = adminData.companyId;

  useEffect(() => {
    console.log('adminData:', adminData);
    console.log('currentCompanyId:', currentCompanyId);
  const fetchEmployees = async () => {
    const res = await fetch(`http://localhost:3000/api/user/employees?companyId=${currentCompanyId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
    });
    const employees = await res.json();
    console.log('Fetched employees:', employees);
    if (Array.isArray(employees)) {
      setEmployeeList(employees);
    } else {
      setEmployeeList([]); // or setError('Failed to fetch employees');
    }
  };
  fetchEmployees();
}, [currentCompanyId]);


  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      setProjects(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load projects');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAssignProject = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newProject.employeeId) {
    alert('Please select an employee');
    return;
  }
  const res = await fetch('http://localhost:3000/api/projects', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      employeeId: Number(newProject.employeeId),
      projectName: newProject.projectName
    })
  });
  if (!res.ok) {
    alert('Failed to assign project');
    return;
  }
  fetchProjects();
  setNewProject({ employeeId: '', projectName: '' });
  setIsModalOpen(false);
};

  const markComplete = (id: number, link: string) => {
    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, status: 'completed', githubLink: link } : p
      )
    );
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 pt-2">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Assign Projects</h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-700 focus:outline-none"
          data-tooltip-id="assign-tooltip"
          data-tooltip-content="Assign a new project"
        >
          <FaPlus />
          <span>Assign Project</span>
        </button>
        <ReactTooltip id="assign-tooltip" className="z-50" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">Employee</th>
              <th className="p-3 text-left text-sm font-semibold">Project</th>
              <th className="p-3 text-left text-sm font-semibold">Status</th>
              <th className="p-3 text-left text-sm font-semibold">GitHub Link</th>
              <th className="p-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{project.employeeName}</td>
                <td className="p-3">{project.projectName}</td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </td>
                <td className="p-3">
                  {project.githubLink ? (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <FaLink />
                      <span>View</span>
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="p-3">
                  {project.status === 'assigned' && (
                    <button
                      onClick={() => {
                        const link = prompt('Enter GitHub link for completion:');
                        if (link) markComplete(project.id, link);
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaCheckCircle className="inline mr-1" /> Mark Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Assign Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h3 className="text-lg font-bold mb-4">Assign New Project</h3>
        <form onSubmit={handleAssignProject} className="space-y-4">
          
          <label htmlFor="employeeId">Employee</label>
          <select
            id="employeeId"
            name="employeeId"
            value={newProject.employeeId}
            onChange={e => setNewProject({ ...newProject, employeeId: e.target.value })}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select employee</option>
            {employeeList.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.projectName}
            onChange={e => setNewProject({ ...newProject, projectName: e.target.value })}
            required
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
            >
              Assign
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssignProjects;
