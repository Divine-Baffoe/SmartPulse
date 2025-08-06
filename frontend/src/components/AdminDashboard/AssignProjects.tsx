// src/components/AdminDashboard/AssignProjects.tsx
import React, { useState, useEffect,  } from 'react';
import { FaPlus, FaLink, FaTrashAlt, FaUserCircle } from 'react-icons/fa';
import Modal from 'react-modal';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';


Modal.setAppElement('#root');

interface Project {
  id: number;
  avatarUrl?: string; // Google account image URL
  employeeName: string;
  projectName: string;
  githubLink?: string;
  status: 'assigned' | 'submitted' | 'completed' | 'rejected';
  dueDate?: string; //  field for due date
  submittedAt?: string; //field for received date
  projectDescription?: string; // field for project description
}

const AssignProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const adminData = JSON.parse(localStorage.getItem('user') || '{}');
  const currentCompanyId = adminData.companyId;
 
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const navigate = useNavigate();
const openProjectModal = (project: Project) => {
  setSelectedProject(project);
};

const closeProjectModal = () => {
  setSelectedProject(null);
};

console.log("Project Data", projects);

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


  const markComplete = async (id: number, link: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/projects/${id}/complete`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ githubLink: link}),
    });

    if (!res.ok) {
      throw new Error('Failed to mark project complete');
    }

    // ✅ Refetch updated projects to get submittedAt
    fetchProjects();
    setSelectedProject(null); // Close the modal after marking complete
  } catch (err) {
    alert('Error completing project');
    console.error(err);
  }
};

 const deleteProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to delete project');
      setProjects(projects.filter(project => project.id !== id));
    } catch (err) {
      alert('Error deleting project');
      console.error(err);
    }
  };

  const rejectProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to reject this project?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/projects/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to reject project');
      setProjects(projects.filter(project => project.id !== id));
      setSelectedProject(null); // Close the modal after rejecting
    } catch (err) {
      alert('Error rejecting project');
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 pt-2">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Assign Projects</h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/admin/dashboard/assign-project')}
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
              <th className="p-3 text-left text-sm font-semibold">👤 Employee</th>
              <th className="p-3 text-left text-sm font-semibold">📌 Project</th>
              <th className="p-3 text-left text-sm font-semibold">📊 Status</th>
              <th className="p-3 text-left text-sm font-semibold">🛠️ Action</th>
              <th className="p-3 text-left text-sm font-semibold">📅 Due Date</th>
              <th className="p-3 text-left text-sm font-semibold">🗑️ Delete</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    {project.avatarUrl ? (
                      <img
                        src={project.avatarUrl}
                        alt={project.employeeName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="h-8 w-8 text-gray-400" />
                    )}
                    <span>{project.employeeName}</span>
                  </div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => setModalProject(project)}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full hover:bg-indigo-200 transition duration-200 font-semibold"
                  >
                    {project.projectName}
                  </button>
                </td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'assigned'
                          ? 'bg-blue-100 text-black-500'
                          : project.status === 'submitted'
                          ? 'bg-blue-100 text-white-400'
                          : project.status === 'completed'
                          ? 'bg-green-100 text-black-800'
                          : project.status === 'rejected'
                          ? 'bg-blue-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'

                      }`}

                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </td>
                <td className="p-3">
                <button
                  onClick={() => openProjectModal(project)}
                  className="px-3 py-1 bg-gradient-to-br from-indigo-500 to-pink-300 rounded-md hover:bg-orange-600 focus:outline-none text-white"
                >
                  View
                </button>
                </td>

                <td className="p-3">
                  {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : '—'}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <FaTrashAlt className="inline mr-1" /> Delete
                  </button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
        {selectedProject && (
            <Modal
              isOpen={!!selectedProject}
              onRequestClose={closeProjectModal}
              className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <h3 className="text-lg font-bold mb-4">Project Details</h3>
              <p><strong>Project:</strong> {selectedProject.projectName}</p>
              <p><strong>Due Date:</strong> {new Date(selectedProject.dueDate!).toLocaleString()}</p>
              <p><strong>Submitted At:</strong> {selectedProject.submittedAt ? new Date(selectedProject.submittedAt!).toLocaleString() : 'Not submitted yet'}</p>

              {/* Lateness logic */}
              {selectedProject.submittedAt && new Date(selectedProject.submittedAt) > new Date(selectedProject.dueDate!) ? (
                <div className="mt-4 text-red-600">
                  <p>This project was submitted late.</p>
                  <button
                    onClick={() => rejectProject(selectedProject.id)}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject Project
                  </button>
                </div>
              ) : (
                <div className="mt-4 p-3 flex flex-1 gap-3">
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <FaLink />
                    <span>View Project</span>
                  </a>
                  <button
                    onClick={() => markComplete(selectedProject.id, selectedProject.githubLink!)}
                    className="mt-2 px-2 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Mark Complete
                  </button>
                </div>
              )}

              <button
                onClick={closeProjectModal}
                className="mt-4 px-4 py-2 text-gray-600"
              >
                Close
              </button>
            </Modal>
          )} 
      </div>
      {modalProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setModalProject(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl focus:outline-none"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-indigo-700 mb-2">{modalProject.projectName}</h3>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold text-indigo-600">📝 Description:</span><br />
              {modalProject.projectDescription || 'No description provided.'}
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                Status: {modalProject.status}
              </span>
              {modalProject.dueDate && (
                    <span className="ml-10">
                  📅 Due: {new Date(modalProject.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignProjects;
