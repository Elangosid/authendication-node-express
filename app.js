const express = require('express')
const authRoutes = require('./routes/authRoutes')
const productRoutes= require('./routes/productRoutes')
const { errorHandler } = require('./errors/errorHandler')
const connectDB = require('./db/connection')
require('dotenv').config()

const app = express()
app.use(express.json())

connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes);

// Error handling
app.use(errorHandler)

module.exports = app
