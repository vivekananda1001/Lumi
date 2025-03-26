import express from 'express';
import authController from '../controllers/authController.js';
import taskController from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/tasks', authMiddleware, taskController.createTask);
router.get('/tasks', authMiddleware, taskController.getTasks);
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);
router.get('/tasks/:id', authMiddleware, taskController.getTaskById);

router.post('/gpt', taskController.chatWithGpt); // Add this line

export default router;