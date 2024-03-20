import express from 'express'
import { isAuthenticated} from '../middlewares/auth.js'
import { addMembers, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, sendAttachments } from '../controllers/chat.controller.js';
import { attachments } from '../middlewares/multer.js';

export const router = express.Router()

router
.post("/new",isAuthenticated,newGroupChat)
.get("/my",isAuthenticated,getMyChats)
.get("/my/groups",isAuthenticated,getMyGroups)
 .put("/addMembers",isAuthenticated,addMembers)
 .put("/removeMember",isAuthenticated,removeMembers)
 .delete("/leave/:chatId",isAuthenticated,leaveGroup)
 .post("/message",isAuthenticated,attachments,sendAttachments);
 