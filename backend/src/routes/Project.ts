import express from 'express';
import { getProjects, assignProject, completeProject } from '../controllers/User'; // Or Project if you split controllers
import authMiddleware from '../middleware/authMiddleware';

const ProjectRoutes = express.Router();

function asyncHandler(fn: any) {
  return function(req: express.Request, res: express.Response, next: express.NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

ProjectRoutes.get('/', authMiddleware, asyncHandler(getProjects));
ProjectRoutes.post('/', authMiddleware, asyncHandler(assignProject));
ProjectRoutes.patch('/:id/complete', authMiddleware, asyncHandler(completeProject));

export default ProjectRoutes;