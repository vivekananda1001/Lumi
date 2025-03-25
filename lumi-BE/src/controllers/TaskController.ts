import { Request , Response } from 'express';
import prisma from '../config/db.config.js';

interface Task {
    id: string;
    title: string;
    description: string;
    authorId: string;
  }

  interface CreateTaskDto {
    title: string;
    description: string;
    authorId: string;
  }
  
  class TaskController {
    // Create a new task
    public async createTask(req: Request, res: Response): Promise<void> {
      try {
        const taskData: CreateTaskDto = req.body;
  
        const newTask = await prisma.task.create({
          data: {
            title: taskData.title,
            description: taskData.description,
            author: {
              connect: { id: taskData.authorId }
            }
          },
        });
  
        res.status(201).json({
          success: true,
          data: newTask,
          message: 'Task created successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error creating task',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  
    // Get all tasks
    public async getAllTasks(req: Request, res: Response): Promise<void> {
      try {
        const tasks = await prisma.task.findMany({
          include: {
            author: {
              select: {
                id: true,
              }
            }
          }
        });
  
        res.status(200).json({
          success: true,
          data: tasks,
          message: 'Tasks retrieved successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error retrieving tasks',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  
    // Get task by ID
    public async getTaskById(req: Request, res: Response): Promise<void> {
      try {
        const { id } = req.params;
  
        const task = await prisma.task.findUnique({
          where: { id },
          include: {
            author: {
              select: {
                id: true,
                // Add other user fields you want to include
              }
            }
          }
        });
  
        if (!task) {
          res.status(404).json({
            success: false,
            message: 'Task not found'
          });
          return;
        }
  
        res.status(200).json({
          success: true,
          data: task,
          message: 'Task retrieved successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error retrieving task',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  
    // Update task
    public async updateTask(req: Request, res: Response): Promise<void> {
      try {
        const { id } = req.params;
        const taskData: Partial<CreateTaskDto> = req.body;
  
        const updatedTask = await prisma.task.update({
          where: { id },
          data: {
            title: taskData.title,
            description: taskData.description,
            ...(taskData.authorId && {
              author: {
                connect: { id: taskData.authorId }
              }
            })
          }
        });
  
        res.status(200).json({
          success: true,
          data: updatedTask,
          message: 'Task updated successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error updating task',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  
    // Delete task
    public async deleteTask(req: Request, res: Response): Promise<void> {
      try {
        const { id } = req.params;
  
        await prisma.task.delete({
          where: { id }
        });
  
        res.status(200).json({
          success: true,
          message: 'Task deleted successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error deleting task',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }
  
  export default TaskController;