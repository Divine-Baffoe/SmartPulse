import { Request, Response } from 'express';


import { userService, projectService } from '../services/User';

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
};

export const getProjects = async (req: Request, res: Response) => {
  const projects = await projectService.getAll();
  res.json(
    projects.map((p: any) => ({
      id: p.id,
      employeeName: p.user.name,
      projectName: p.projectName,
      githubLink: p.githubLink,
      status: p.status,
    }))
  );
};

export const assignProject = async (req: Request, res: Response) => {
  const { employeeId, projectName } = req.body;
  const project = await projectService.assign(employeeId, projectName);
  res.status(201).json(project);
};

export const completeProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { githubLink } = req.body;
  const project = await projectService.markComplete(Number(id), githubLink);
  res.json(project);
};

export default userController;