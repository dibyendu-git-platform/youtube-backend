import { asyncHandler } from '../utils/asyncHandeler.js';


const registerUser = asyncHandler(async (req, res) => {
  // Logic for registering a user
  res.status(201).json({ message: 'User registered successfully' });
});

export {registerUser};