import express from 'express';
import cors from 'cors'
import { configDotenv } from 'dotenv';
import { classifyRouter } from './routes/classifyRoute.js';

configDotenv()


const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json())
app.use(cors())

// Routes
app.use('/api', classifyRouter)

app.get('/', (req, res) => {
    res.send('hello world')
})

// Connection server
app.listen(port, () => {
    console.log(`Server is listening on ${'localhost'}:${port}`)
})