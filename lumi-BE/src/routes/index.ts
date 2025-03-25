import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/AuthMiddlewares.js';
const router = Router();

// auth routes
router.post("/auth/login", AuthController.login)

export default router; 