const User = require('../models/userModel')
const jwt = require('../utils/jwtUtils')
const bcrypt = require('bcrypt')

exports.register = async (req, res, next) => {
  try {
    const { username, password, email } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    res.status(201).json({ message: 'User registered successfully', newUser })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.generateToken(user._id)
    res.status(200).json({ message: 'Login successful', token })
  } catch (error) {
    next(error)
  }
}
