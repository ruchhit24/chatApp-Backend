import express from 'express'
import { isAuthenticated} from '../middlewares/auth.js'
import { addMembers, deleteGroup, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, renameGroup, sendAttachments } from '../controllers/chat.controller.js';
import { attachments } from '../middlewares/multer.js';
import { addMemberValidator, getChatIdValidator, leaveGroupValidator, newGroupValidator, removeMemberValidator, renameGroupValidator, sendAttachmentsValidator, validateHandler } from '../utils/validator.js';

export const router = express.Router()

router
.post("/new",isAuthenticated,newGroupValidator(),validateHandler,newGroupChat)
.get("/my",isAuthenticated,getMyChats)
.get("/my/groups",isAuthenticated,getMyGroups)
 .put("/addMembers",isAuthenticated,addMemberValidator(),validateHandler,addMembers)
 .put("/removeMember",isAuthenticated,removeMemberValidator(),validateHandler,removeMembers)
 .delete("/leave/:chatId",isAuthenticated,leaveGroupValidator(),validateHandler,leaveGroup)
 .post("/message",isAuthenticated,attachments,sendAttachmentsValidator(),validateHandler,sendAttachments)
 .get("/:id",isAuthenticated,getChatIdValidator(),validateHandler,getChatDetails)
 .put("/:id",isAuthenticated,renameGroupValidator(),validateHandler,renameGroup)
 .delete("/:id",isAuthenticated,getChatIdValidator(),validateHandler,deleteGroup)
 .get("/message/:id",isAuthenticated,getChatIdValidator(),validateHandler,getMessages)

