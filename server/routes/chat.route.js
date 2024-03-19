import express from 'express'
import { isAuthenticated} from '../middlewares/auth.js'
import { addMembers, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers } from '../controllers/chat.controller.js';

export const router = express.Router()

router
.post("/new",isAuthenticated,newGroupChat)
.get("/my",isAuthenticated,getMyChats)
.get("/my/groups",isAuthenticated,getMyGroups)
 .put("/addMembers",isAuthenticated,addMembers)
 .put("/removeMember",isAuthenticated,removeMembers)
 .delete("/leave/:chatId",isAuthenticated,leaveGroup)
 
 