import express from 'express'
import { userTestContoller } from '../controllers/user.controller.js';

export const router = express.Router();


router.get('/',userTestContoller);
