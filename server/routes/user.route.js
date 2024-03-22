import express from 'express'
import { getMyProfile, login, logout, newUser, userTestContoller } from '../controllers/user.controller.js';
import { AvatarUpload } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { loginValidator, registerValidator, validateHandler } from '../utils/validator.js';

export const router = express.Router();


router
.get('/',userTestContoller)
.post('/new',AvatarUpload,registerValidator(),validateHandler,newUser)
.post('/login',loginValidator(),validateHandler,login)


// ab yha se sare routes me authentication required h
router.use(isAuthenticated)
.get("/me",getMyProfile)
.get("/logout",logout)
