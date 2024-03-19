import express from 'express'
import { getMyProfile, login, logout, newUser, userTestContoller } from '../controllers/user.controller.js';
import { AvatarUpload } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';

export const router = express.Router();


router
.get('/',userTestContoller)
.post('/new',AvatarUpload,newUser)
.post('/login',login)
.get("/me",isAuthenticated,getMyProfile)
.get("/logout",logout)