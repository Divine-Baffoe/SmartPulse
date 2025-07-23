import express from 'express';
import { getProjects, assignProject, completeProject, getEmployeesByCompany } from '../controllers/User';
import authMiddleware from '../middleware/authMiddleware';

const ProjectRoutes = express.Router();

function asyncHandler(fn: any) {
  return function(req: express.Request, res: express.Response, next: express.NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Project endpoints
ProjectRoutes.get('/', authMiddleware, asyncHandler(getProjects)); // GET /api/projects
ProjectRoutes.post('/', authMiddleware, asyncHandler(assignProject)); // POST /api/projects
ProjectRoutes.patch('/:id/complete', authMiddleware, asyncHandler(completeProject)); // PATCH /api/projects/:id/complete
 

export default ProjectRoutes;