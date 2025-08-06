//This will handele user-specific endpoints ( /api/user/activity, /api/user/stats)
import express from 'express';
import authMiddleware from "../middleware/authMiddleware";
import userController, { getEmployeesByCompany } from '../controllers/User';




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
UserRoutes.put('/update-settings', authMiddleware, asyncHandler(userController.updateSettings));
UserRoutes.get('/employees', authMiddleware, asyncHandler(getEmployeesByCompany));
UserRoutes.post('/upload-image', authMiddleware, asyncHandler(userController.uploadProfileImage)); // Endpoint to upload profile image
UserRoutes.get('/profile', authMiddleware, asyncHandler(userController.getAdminProfileSettings)); // Endpoint to get employee by ID
UserRoutes.get('/profile-update', authMiddleware, asyncHandler(userController.updateAdminProfileSettings)); // Endpoint to get employee by ID



export default UserRoutes;
