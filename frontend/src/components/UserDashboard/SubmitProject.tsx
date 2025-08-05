import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaLink } from 'react-icons/fa';

interface Project {
  id: number;
  projectName: string;
  status: 'assigned' | 'submitted'| 'rejected';
  githubLink?: string;
  dueDate?: string;
  projectDescription?: string;
}

const EmployeeProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const employeeId = userData.id;
  const [modalProject, setModalProject] = useState<Project | null>(null);
  console.log('userData:', userData);
  console.log('employeeId:', employeeId);
  console.log('ProjectId', projects.map(p => p.id));

  
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch(`http://localhost:3000/api/employees/projects?employeeId=${employeeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchProjects();
  }, [employeeId]);

  const handleSubmitLink = async (projectId: number) => {
    const githubLink = prompt('Enter your GitHub link:');
    if (!githubLink) return;
    const res = await fetch(`http://localhost:3000/api/employees/projects/${projectId}/submit`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ githubLink })
    });
    if (res.ok) {
      setProjects(projects.map(p =>
        p.id === projectId ? { ...p, status: 'submitted', githubLink } : p
      ));
    } else {
      alert('Failed to submit project');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Projects</h2>
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">📌 Project</th>
            <th className="p-3 text-left">📊 Status</th>
            <th className="p-3 text-left">🔗 GitHub Link</th>
            <th className="p-3 text-left">🛠️ Actions</th>
            <th className="p-3 text-left">📅 Due Date</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id} className="border-t">
              <td className="p-3">
                <button
                  onClick={() => setModalProject(project)}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full hover:bg-indigo-200 transition duration-200 font-semibold"
                >
                  {project.projectName}
                </button>
              </td>
              <td className="p-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  project.status === 'submitted' ? 'bg-green-100 text-green-900' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </td>
              <td className="p-3">
                {project.githubLink ? (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center space-x-1">
                    <FaLink />
                    <span>View</span>
                  </a>
                ) : '—'}
              </td>
              <td className="p-3">
                {project.status === 'assigned' && (
                  <button
                    onClick={() => handleSubmitLink(project.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaCheckCircle className="inline mr-1" /> Submit Project
                  </button>
                )}
              </td>
              <td className="p-3">
                {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default EmployeeProjects;