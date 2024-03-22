import express from 'express'
import { acceptFriendRequest, getMyFriends, getMyNotifications, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest, userTestContoller } from '../controllers/user.controller.js';
import { AvatarUpload } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from '../utils/validator.js';

export const router = express.Router();


router
.get('/',userTestContoller)
.post('/new',AvatarUpload,registerValidator(),validateHandler,newUser)
.post('/login',loginValidator(),validateHandler,login)


// ab yha se sare routes me authentication required h
router.use(isAuthenticated)
.get("/me",getMyProfile)
.get("/logout",logout)
.get("/search",searchUser)
.put("/sendrequest",sendRequestValidator(),validateHandler,sendFriendRequest)
.put("/acceptrequest",acceptRequestValidator(),validateHandler,acceptFriendRequest)
.get('/notifications',getMyNotifications)
.get("/friends",getMyFriends)
