import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import myUserRoute from './routes/MyUserRoutes'
const app = express()
app.use(cors())

const PORT = process.env.PORT
const connectionString = process.env.MONGODB_CONNECTION_STRING

if (!connectionString) {
    throw new Error('MONGODB_CONNECTION_STRING is not defined')
}

mongoose.connect(connectionString).then(() => console.log('database connected'))

app.use(express.json())
app.use('/api/my/user', myUserRoute)

app.use('/health', (req, res) => {
    res.send('THIS IS FROM SERVER')
})

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})
