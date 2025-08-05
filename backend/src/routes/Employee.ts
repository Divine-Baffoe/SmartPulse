import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import employeeController from '../controllers/Employee';
import { getEmployeeProjects, submitProject } from '../controllers/Employee';


const EmployeeRoutes = express.Router();

function asyncHandler(fn: any) {
    return function(req: express.Request, res: express.Response, next: express.NextFunction) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

EmployeeRoutes.get('/stats', authMiddleware, asyncHandler(employeeController.getUserStats));
EmployeeRoutes.get('/stress', authMiddleware, asyncHandler(employeeController.getUserStress));
EmployeeRoutes.get('/work-summary', authMiddleware, asyncHandler(employeeController.getWorkSummary));
EmployeeRoutes.get('/settings', authMiddleware, asyncHandler(employeeController.getSettings));
EmployeeRoutes.put('/update-settings', authMiddleware, asyncHandler(employeeController.updateSettings));
EmployeeRoutes.get('/projects', authMiddleware, asyncHandler(getEmployeeProjects));
EmployeeRoutes.patch('/projects/:id/submit', authMiddleware, asyncHandler(submitProject));




export default EmployeeRoutes;