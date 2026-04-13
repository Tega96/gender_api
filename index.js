import express from 'express';
import { configDotenv } from 'dotenv';
import { classifyRouter } from './routes/classifyRoute.js';

configDotenv()


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.use('/api', classifyRouter)

app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`Server is listening on ${'localhost'}:${port}`)
})