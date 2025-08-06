import { io } from '../server';
import { Request, Response } from 'express';
import { employeeService } from '../services/Employee';
import cloudinary from '../lib/cloudinary';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};


const employeeController = {
  getUserStats: async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { period = 'day' } = req.query;
    if (!['day', 'week', 'month'].includes(period as string)) {
      return res.status(400).json({ error: 'Invalid period' });
    }
    try {
      const stats = await employeeService.getUserStats(req.user.id, period as 'day' | 'week' | 'month');
      res.json(stats);
    } catch {
      res.status(500).json({ error: 'Failed to fetch productivity stats' });
    }
  },

  getUserStress: async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    try {
      
      const { period = 'day' } = req.query;
      if (!['day', 'week', 'month'].includes(period as string)) {
        return res.status(400).json({ error: 'Invalid period' });
      }
      const stress = await employeeService.getUserStressInsights(req.user.id, period as 'day' | 'week' | 'month');
      res.json(stress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stress insights' });
    }
  },

  getSettings: async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const settings = await employeeService.getSettings(req.user.id);
      res.json(settings);
    } catch {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  },
  updateSettings: async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const updated = await employeeService.updateSettings(req.user.id, req.body);
      res.json(updated);
    } catch {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  },
  getWorkSummary: async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { period = 'week' } = req.query;
    try {
      const summary = await employeeService.getWorkSummary(req.user.id, period as 'day' | 'week' | 'month');
      res.json(summary);
    } catch {
      res.status(500).json({ error: 'Failed to fetch work summary' });
    }
  },
  // Add to existing controllers/Employee.ts
//logUserActivity: async (req: Request, res: Response) => {
  //try {
   //const userId = req.user.id ;
 //const { activities } = req.body;
  //if (!Array.isArray(activities)) {
 //return res.status(400).json({ error: 'Activities must be an array' });
  //}
  //const sessions = await employeeService.logUserActivity(userId, activities);
    //res.json({ message: 'Activities logged', sessions });
  //} catch (error) {
    //res.status(500).json({ error: 'Failed to log activities' });
  //}
//},

  uploadProfileImage: async (req: Request, res: Response) => {
  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });

    const imageFile = files.image;

    if (!imageFile) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Handle both single and array cases
    const file = Array.isArray(imageFile) ? imageFile[0] : imageFile;

    if (!file.filepath) {
      return res.status(400).json({ error: 'Invalid file structure' });
    }

    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'employee_profiles',
      });

      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      await employeeService.uploadProfileImage(userId, result.secure_url);

      return res.status(200).json({ imageUrl: result.secure_url });
    } catch (uploadError) {
      return res.status(500).json({ error: 'Cloudinary upload failed' });
    }
  });
},

};




// Get projects assigned to employee
export const getEmployeeProjects = async (req: Request, res: Response) => {
  const employeeId = parseInt(req.query.employeeId as string);
  if (!employeeId || isNaN(employeeId)) {
    return res.status(400).json({ error: 'Invalid employee ID' });
  }
  try {
    const projects = await employeeService.getProjectsByEmployee(employeeId);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Employee submits project (GitHub link)
export const submitProject = async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id as string);
  const { githubLink } = req.body;
  if (!githubLink) {
    return res.status(400).json({ error: 'Missing GitHub link' });
  }
  try {
    const project = await employeeService.submitProject(projectId, githubLink);
    
    if (!project || !project.user) {
      return res.status(404).json({ error: 'Project or user not found' });
    }

    // Notify admin via Socket.IO
    io.emit('project:submitted', {
      projectId: project.id,
      employeeName: project.user.name,
      projectName: project.projectName,
    });



    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit project' });
  }
};

export default employeeController;

