import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const authController = {
  signup: async (req, res) => {
    try {
      const { name, email, provider, oauth_id, image } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const user = new User({ name, email, provider, oauth_id, image });
      await user.save();

      const payload = { id: user._id, name, email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '365d' });

      res.status(201).json({
        message: 'User created successfully',
        user: { ...user.toObject(), token: `Bearer ${token}` },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
  },

  login: async (req, res) => {
    try {
      const { name, email, provider, oauth_id, image } = req.body;

      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ name, email, provider, oauth_id, image });
        await user.save();
      }

      const payload = { id: user._id, name, email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '365d' });

      res.json({
        message: 'Logged In Successfully',
        user: { ...user.toObject(), token: `Bearer ${token}` },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
  },
};

export default authController;