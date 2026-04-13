import { Router } from 'express'
import { classify } from '../controllers/classifyController.js';

export const classifyRouter = Router();

classifyRouter.get('/classify', classify )

