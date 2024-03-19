import {Chat} from '../models/chat.model.js'
import { User } from '../models/user.model.js'; 
// import { ALERT, REFETCH_CHATS } from '../constants/socketEvents.js';

export const newGroupChat = async( req,res,next )=>{
    const {name,members } =req.body;
    
    if(members.lenfgth < 2 ){
    return res.status(401).json({message : "group must hv atlast 3 memeners"})
    }
    
    const allMembers = [...members,req.user]
    
    await Chat.create({name,groupChat:true,creator:req.user,members:allMembers})
    
    // NOTE: after this we will create a socket event here, we willl define an ALERT to all the menbers of the group, second event we will hv is REFETCH_CHATS
    
    return res.status(201).json({success:true,message:'group created'})
}

export const getMyChats = async (req, res, next) => {
    try {
        const getOtherMember = (members, userId) => {
            return members.find((member) => member._id.toString() !== userId.toString());
        };

        const chats = await Chat.find({ members: req.user })
            .populate("members", "avatar name");

            // console.log(chats[0].members[0].avatar.url)
            // need to take care of avatar field

        const transformedChats = chats.map((chat) => {
            const otherMember = getOtherMember(chat.members, req.user);
            
            //since in members array we just need only the is'd of the members
            const membersIds = chat.members.map((member) => member._id.toString());
            return {
                _id: chat._id,
                groupChat: chat.groupChat,
                avatar: chat.groupChat ? chat.avatar : otherMember.avatar.url,
                name: chat.groupChat ? chat.name : otherMember.name,
                members: membersIds,
            };
        });

        return res.status(200).json({ success: true, transformedChats });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getMyGroups = async (req, res, next) => {
    try {
        const chats = await Chat.find({ members: req.user, groupChat: true, creator: req.user }).populate("members", "name avatar");
        
        const groups = chats.map(({ _id, groupChat, name, avatar }) => ({
            _id,
            groupChat,
            name,
            avatar,
        }));

        return res.status(200).json({ success: true, groups });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const addMembers = async (req, res, next) => {
    try {
        const { chatId, members } = req.body;
        
        if (!members || members.length < 1) 
            return res.status(400).json({message : "Please provide members" })

        const chat = await Chat.findById(chatId);
        
        if (!chat)
        return res.status(400).json({message : "Please provide members" })
            

        if (!chat.groupChat)
        return res.status(400).json({message :"This is not a group chat"}) 

        if (chat.creator.toString() !== req.user.toString())
        return res.status(400).json({message : "You are not allowed to add members"}) 

        const allNewMembersPromise = members.map((memberId) => User.findById(memberId, "name"));
        const allNewMembers = await Promise.all(allNewMembersPromise);

        const uniqueMemberIds = allNewMembers
            .filter((member) => !chat.members.includes(member._id.toString()))
            .map((member) => member._id);

        chat.members.push(...uniqueMemberIds);

        if (chat.members.length > 100)
        return res.status(400).json({message : "Group members limit exceeded" })
         

        await chat.save();

        const allUserNames = allNewMembers.map((member) => member.name).join(",");

        // Emitting an event
        // emitEvent(req, ALERT, chat.members, `${allUserNames} has been added to the group`);
        // emitEvent(req, REFETCH_CHATS, chat.members);

        return res.status(201).json({ success: true, message: 'Members added successfully' });
    } catch (error) {
        next(error);
    }
};


export const removeMembers = async (req, res, next) => {
    try {
        const { userId, chatId } = req.body;
        
        const chat = await Chat.findById(chatId);
        const userToBeRemoved = await User.findById(userId, "name");

        if (!chat)
        return res.status(400).json({message : "Chat not found" })
            

        if (!chat.groupChat)
        return res.status(400).json({message :"This is not a group chat"}) 

        if (chat.creator.toString() !== req.user.toString())
        return res.status(400).json({message : "You are not allowed to remove members"}) 
         

        if (chat.members.length <= 3) 
            return res.status(400).json({message :"Group must have at least 3 members"}) 

        chat.members = chat.members.filter((member) => member.toString() !== userId.toString());

        await chat.save();

        console.log(`${userToBeRemoved.name} has been removed from the group`)
        // // Emitting events
        // emitEvent(req, ALERT, chat.members, `${userToBeRemoved.name} has been removed from the group`);
        // emitEvent(req, REFETCH_CHATS, chat.members);

        return res.status(201).json({ success: true, message: 'Member removed successfully' });
    } catch (error) {
        next(error);
    }
};

export const leaveGroup = async (req, res, next) => {
    try {
        const chatId = req.params.chatId;
        const chat = await Chat.findById(chatId);

        if (!chat)
        return res.status(400).json({message : "Chat not found" })
            

        if (!chat.groupChat)
        return res.status(400).json({message :"This is not a group chat"}) 

        // If the user is the creator of the group, assign a new creator
        if (chat.creator.toString() === req.user.toString()) {
            const remainingMembers = chat.members.filter((member) => member.toString() !== req.user.toString());

            if (remainingMembers.length < 3)
            return res.status(400).json({message :"Group must have at least 3 members"}) 

            const randomMemberIndex = Math.floor(Math.random() * remainingMembers.length);
            const newCreator = remainingMembers[randomMemberIndex];
            chat.creator = newCreator;
        }

        // Remove the user from the members array
        chat.members = chat.members.filter((member) => member.toString() !== req.user.toString());

        // Get user's name for emitting events
        const user = await User.findById(req.user, "name");

        await chat.save();

        console.log(`${user.name} has left the group`)
        // Emitting events
        // emitEvent(req, ALERT, chat.members, `${user.name} has left the group`);
        // emitEvent(req, REFETCH_CHATS, chat.members);

        return res.status(201).json({ success: true, message: 'Member removed successfully' });
    } catch (error) {
        next(error);
    }
};