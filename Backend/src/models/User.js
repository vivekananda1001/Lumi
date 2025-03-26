import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String },
  provider: { type: String },
  oauth_id: { type: String },
  image: { type: String },
});

const User = mongoose.model('User', userSchema);

export default User;