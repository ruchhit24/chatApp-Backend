import express from 'express'
import { newUser, userTestContoller } from '../controllers/user.controller.js';

export const router = express.Router();


router
.get('/',userTestContoller)
.post('/new',newUser)
