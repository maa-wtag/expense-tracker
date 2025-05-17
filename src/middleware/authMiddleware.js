import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";

// After passport local authentication, user is on req.user
export const loginUser = (req, res) => {
  const user = req.user;
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });
    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};
