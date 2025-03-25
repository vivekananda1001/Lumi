import Task from '../models/Task.js';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js'; // Import the new model
import callGptModel from '../utils/gptClient.js'; // Import the GPT client

const taskController = {
  createTask: async (req, res) => {
    try {
      const { title, description, startTime, endTime, priority } = req.body;
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }
      const author = req.user.id;

      const task = new Task({ title, description, author, startTime, endTime, priority });
      await task.save();

      res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getTasks: async (req, res) => {
    try {
      const author = req.user.id;
      const tasks = await Task.find({ author });

      res.json({ tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const author = req.user.id;
      const { id } = req.params;

      const task = await Task.findOneAndDelete({ author, _id: id });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const author = req.user.id;
      const { id } = req.params;

      const task = await Task.findOne({ author, _id: id });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json({ task });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  chatWithGpt: async (req, res) => {
    try {
      const userId = req.user.id; // From auth middleware
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({ message: 'Query is required' });
      }

      // System message to instruct GPT
      const systemMessage = {
        role: 'system',
        content: `You are an AI assistant for task prioritization. Based on the user's query: "${query}", provide a JSON object with a "tasks" array, where each task has "title", "priority", "startTime" and "endTime".Also give a textual description of how the user should spend his day, add this to json field "description". Generate task suggestions based solely on the query.`
      };

      const messages = [systemMessage, { role: 'user', content: query }];

      // Call GPT model
      const gptResponseText = await callGptModel(messages);
      let gptResponse;
      try {
        gptResponse = JSON.parse(gptResponseText);
      } catch (parseError) {
        console.error('Failed to parse GPT response as JSON:', parseError);
        return res.status(500).json({ message: 'Invalid response from AI model' });
      }

      if (!Array.isArray(gptResponse.tasks)) {
        return res.status(500).json({ message: 'Invalid task format from AI model' });
      }

      // Process the suggested tasks
      const suggestedTasks = gptResponse.tasks;
      for (const suggestedTask of suggestedTasks) {
        const { title, priority, startTime, endTime } = suggestedTask;
        // Create new task (since tasks are not input, all are new suggestions)
        const newTask = new Task({
          title,
          priority,
          author: userId,
        });
        await newTask.save();
      }

      // Return GPT's response to the client
      res.json({ response: gptResponse });
    } catch (error) {
      console.error('Error in chatWithGpt:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

export default taskController;