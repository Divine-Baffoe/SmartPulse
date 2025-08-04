import { Request, Response } from 'express';
import { userService } from '../services/User';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userController = {
  getStats: async (req: Request, res: Response) => {
    const { period = 'day' } = req.query;
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const stats = await userService.getUserStats(req.user.id, period as string);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  },
  getInsights: async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const insights = await userService.getEmployeeInsights(req.user.companyId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch insights' });
    }
  },
  getReports: async (req: Request, res: Response) => {
    const { period = 'day' } = req.query;
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const reports = await userService.getReports(req.user.companyId, period as string);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  },
  getSettings: async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const settings = await userService.getUserSettings(req.user.id);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  },
  getAlerts: async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const alerts = await userService.getUserAlerts(req.user.companyId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  },
  updateSettings: async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const updated = await userService.updateUserSettings(req.user.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  },
  

}


export const getEmployeesByCompany = async (req: Request, res: Response) => {
  const companyId = parseInt(req.query.companyId as string);
  if (!companyId || isNaN(companyId)) {
    return res.status(400).json({ error: 'Invalid company ID' });
  }
  try {
    const employees = await userService.getEmployeesByCompany(companyId);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};


export const getProjects = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const companyId = req.user.companyId;
    const projects = await userService.getAllProjects(companyId);
    //console.log('Raw projectAssignment objects:', projects);

    res.json(
      
      projects.map((p: any) => ({
        id: p.id,
        employeeName: p.user.name,
        projectName: p.projectName,
        githubLink: p.githubLink,
        status: p.status,
        dueDate: p.dueDate ? p.dueDate.toISOString() : null,
        submittedAt: p.submittedAt ? p.submittedAt.toISOString() : null,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const assignProject = async (req: Request, res: Response) => {
  const { employeeId, projectName, dueDate } = req.body;
  if (!employeeId || !projectName) {
    return res.status(400).json({ error: 'Missing employeeId or projectName' });
  }
  const employee = await userService.getEmployeeById(employeeId);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found in company database' });
  }
  const project = await userService.assignProject(employeeId, projectName, dueDate);
  res.status(201).json(project);
};

export const completeProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { githubLink } = req.body;
    //const submittedAt = new Date(); // Automatically set to current date/time, {/*new Date(submittedAt)*/}
    const project = await userService.markProjectComplete(Number(id), githubLink );
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete project' });
  }
};

export const setDueDate = async (req: Request, res: Response) => {
  const {  projectId, dueDate } = req.body;
  if (!projectId || !dueDate) {
    return res.status(400).json({ error: 'Missing projectId or dueDate' });
  } 
  try {
    const project = await userService.updateProjectDueDate(projectId, dueDate);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to set due date' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  try {
    const project = await userService.deleteProject(Number(projectId));
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

export const rejectProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  try {
    const project = await userService.rejectProject(Number(projectId));
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject project' });
  }
};
export default userController;

