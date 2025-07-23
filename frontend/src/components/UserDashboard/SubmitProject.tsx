import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaLink } from 'react-icons/fa';

interface Project {
  id: number;
  projectName: string;
  status: 'assigned' | 'completed';
  githubLink?: string;
}

const EmployeeProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const employeeId = userData.id;
  console.log('userData:', userData);
  console.log('employeeId:', employeeId);

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
        p.id === projectId ? { ...p, status: 'completed', githubLink } : p
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
            <th className="p-3 text-left">Project</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">GitHub Link</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id} className="border-t">
              <td className="p-3">{project.projectName}</td>
              <td className="p-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeProjects;