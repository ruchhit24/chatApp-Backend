import { compare } from "bcrypt"
import { User } from "../models/user.model.js"
import { Request } from "../models/request.model.js"
import {Chat} from '../models/chat.model.js' 
  import { sendToken } from "../utils/sendToken.js"
import { uploadFilesToCloudinary } from "../utils/features.js"

export const userTestContoller = (req,res)=>{
  res.send('hellow world')
}

export const newUser = async(req,res) => {

  const {bio,name,username,password} = req.body;
  const file = req.file;

  console.log(file)

  if(!file)
  {
    return res.status(401).json({success  :false , message : "please upload avatar"})
  }

  const result = await uploadFilesToCloudinary([file]);

  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };
  
  const user = await User.create({ 
   name,
   bio,
   username ,
   password ,
   avatar,
  }
  )
  
  // res.status(201).json({ message : 'user craeted' })

  sendToken(res,user,201,'User Created successfully')
  }

  export const login = async(req,res) =>{ 
    const {username,password } = req.body;
    const user = await User.findOne({username}).select("+password");
    
    if(!user) { return res.status(400).json({message : "invalid username"})}
    
    const isPasswordMatched = await compare(password,user.password);
    
    if(!isPasswordMatched)
    {
    return res.status(400).json({message : "invalid password"});
    }
    
    sendToken(res,user,200,`welcome back ${user.name}`);
  }

  export const getMyProfile = async(req,res) => {
    const user = await User.findById(req.user)
    res.status(200).json({success : true,user});
  }

  export const logout = (req,res) => {
    return res.status(200).clearCookie("access_token").json({success : true , message : "loggout successfully"})
  }

  export const searchUser = async (req, res) => {
    const { name = '' } = req.query;

    const myChats = await User.find({ groupChat: false, members: req.user });
    const allUserFromMyChats = myChats.map((chat) => chat.members).flat();
    
    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUserFromMyChats },
        name: { $regex: name, $options: "i" }
    });

    const users = allUsersExceptMeAndFriends.map((user) => ({
        _id: user._id,
        name: user.name,
        avatar: user.avatar.url
    }));

    return res.status(200).json({ users });
};

export const sendFriendRequest = async (req, res) => {
  const { userId } = req.body;

  const request = await Request.findOne({
      $or: [
          { sender: req.user, receiver: userId },
          { sender: userId, receiver: req.user }
      ]
  });

  if (request) return res.status(400).json({ success: false, message: 'Request already sent' });

  await Request.create({
      sender: req.user,
      receiver: userId,
  });

  // emitEvent(req, NEW_REQUEST, [userId]);
  return res.status(200).json({ success: true, message: 'Friend request sent' });
};

export const acceptFriendRequest = async (req, res) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
      .populate("sender", "name")
      .populate("receiver", "name");

  if (!request) return res.status(404).json({ message: 'Request not found' });

  if (request.receiver._id.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'You are not authorized to accept this request.' });
  }

  if (!accept) {
      await request.deleteOne();
      return res.status(200).json({ message: 'Friend request rejected' });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
      Chat.create({ members, name: `${request.sender.name} - ${request.receiver.name}` }),
      request.deleteOne()
  ]);

  // emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({ success: true, message: 'Friend request accepted', senderId: request.sender._id });
};

export const getMyNotifications = async (req, res) => {
  try {
      const requests = await Request.find({ receiver: req.user }).populate("sender", "name avatar");

      const allRequests = requests.map((request) => ({
          _id: request._id,
          sender: { _id: request.sender._id, name: request.sender.name, avatar: request.sender.avatar.url }
      }));

      return res.status(200).json({ success: true, requests: allRequests });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getMyFriends = async (req, res) => {
  try {

    const getOtherMember = (members, userId) => {
      return members.find(
        (member) => member._id.toString() !== userId.toString()
      );
    };
      const chatId = req.query.chatId;
      let friends;

      const chats = await Chat.find({
          members: req.user,
          groupChat: false,
      }).populate("members", "name avatar");

      friends = chats.map(({ members }) => {
          const otherUser = getOtherMember(members, req.user);
          return {
              _id: otherUser._id,
              name: otherUser.name,
              avatar: otherUser.avatar.url,
          };
      });

      if (chatId) {
          const chat = await Chat.findById(chatId);

          const availableFriends = friends.filter((friend) => 
              !chat.members.includes(friend._id)
          );

          return res.status(200).json({ success: true, friends: availableFriends });
      } else {
          return res.status(200).json({ success: true, friends });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
