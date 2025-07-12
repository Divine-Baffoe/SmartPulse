//This will handele user-specific endpoints ( /api/user/activity, /api/user/stats)
import express from 'express';
import authMiddleware from "../middleware/authMiddleware";
import userController from '../controllers/User';

const UserRoutes = express.Router();

function asyncHandler(fn: any) {
	return function(req: express.Request, res: express.Response, next: express.NextFunction) {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

UserRoutes.get('/stats', authMiddleware, asyncHandler(userController.getStats));
UserRoutes.get('/insights', authMiddleware, asyncHandler(userController.getInsights));
UserRoutes.get('/reports', authMiddleware, asyncHandler(userController.getReports));
UserRoutes.get('/settings', authMiddleware, asyncHandler(userController.getSettings));
UserRoutes.get('/alerts', authMiddleware, asyncHandler(userController.getAlerts));
UserRoutes.put('/settings', authMiddleware, asyncHandler(userController.updateSettings));

export default UserRoutes;
