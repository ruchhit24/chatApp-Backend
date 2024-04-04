import {
  ALERT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import {
  deleteFilesFromCloudinary,
  emitEvent,
  uploadFilesToCloudinary,
} from "../utils/features.js";
// import { ALERT, REFETCH_CHATS } from '../constants/socketEvents.js';
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export const newGroupChat = async (req, res, next) => {
  const { name, members } = req.body;

  // if (members.length < 2) {
  //   return res.status(401).json({ message: "group must hv atlast 3 memeners" });
  // }

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  // NOTE: after this we will create a socket event here, we willl define an ALERT to all the menbers of the group, second event we will hv is REFETCH_CHATS

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({ success: true, message: "group created" });
};

export const getMyChats = async (req, res, next) => {
  try {
    const getOtherMember = (members, userId) => {
      return members.find(
        (member) => member._id.toString() !== userId.toString()
      );
    };

    const chats = await Chat.find({ members: req.user }).populate(
      "members",
      "avatar name"
    );

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
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getMyGroups = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      members: req.user,
      groupChat: true,
      creator: req.user,
    }).populate("members", "name avatar");

    const groups = chats.map(({ _id, groupChat, name, avatar }) => ({
      _id,
      groupChat,
      name,
      avatar,
    }));

    return res.status(200).json({ success: true, groups });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const addMembers = async (req, res, next) => {
  try {
    const { chatId, members } = req.body;

    if (!members || members.length < 1)
      return res.status(400).json({ message: "Please provide members" });

    const chat = await Chat.findById(chatId);

    if (!chat)
      return res.status(400).json({ message: "Please provide members" });

    if (!chat.groupChat)
      return res.status(400).json({ message: "This is not a group chat" });

    if (chat.creator.toString() !== req.user.toString())
      return res
        .status(400)
        .json({ message: "You are not allowed to add members" });

    const allNewMembersPromise = members.map((memberId) =>
      User.findById(memberId, "name")
    );
    const allNewMembers = await Promise.all(allNewMembersPromise);

    const uniqueMemberIds = allNewMembers
      .filter((member) => !chat.members.includes(member._id.toString()))
      .map((member) => member._id);

    chat.members.push(...uniqueMemberIds);

    if (chat.members.length > 100)
      return res.status(400).json({ message: "Group members limit exceeded" });

    await chat.save();

    const allUserNames = allNewMembers.map((member) => member.name).join(",");

    // Emitting an event
    emitEvent(req, ALERT, chat.members, `${allUserNames} has been added to the group`);
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res
      .status(201)
      .json({ success: true, message: "Members added successfully" });
  } catch (error) {
    next(error);
  }
};

export const removeMembers = async (req, res, next) => {
  try {
    const { userId, chatId } = req.body;

    const chat = await Chat.findById(chatId);
    const userToBeRemoved = await User.findById(userId, "name");

    if (!chat) return res.status(400).json({ message: "Chat not found" });

    if (!chat.groupChat)
      return res.status(400).json({ message: "This is not a group chat" });

    if (chat.creator.toString() !== req.user.toString())
      return res
        .status(400)
        .json({ message: "You are not allowed to remove members" });

    if (chat.members.length <= 3)
      return res
        .status(400)
        .json({ message: "Group must have at least 3 members" });

    chat.members = chat.members.filter(
      (member) => member.toString() !== userId.toString()
    );

    await chat.save();

    console.log(`${userToBeRemoved.name} has been removed from the group`);
    // Emitting events
    emitEvent(req, ALERT, chat.members,{
      message: `${userToBeRemoved.name} has been removed from the group`,
      chatId,
    });
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res
      .status(201)
      .json({ success: true, message: "Member removed successfully" });
  } catch (error) {
    next(error);
  }
};

export const leaveGroup = async (req, res, next) => {
  try {
    const chatId = req.params.chatId;
    const chat = await Chat.findById(chatId);

    if (!chat) return res.status(400).json({ message: "Chat not found" });

    if (!chat.groupChat)
      return res.status(400).json({ message: "This is not a group chat" });

    // If the user is the creator of the group, assign a new creator
    if (chat.creator.toString() === req.user.toString()) {
      const remainingMembers = chat.members.filter(
        (member) => member.toString() !== req.user.toString()
      );

      if (remainingMembers.length < 3)
        return res
          .status(400)
          .json({ message: "Group must have at least 3 members" });

      const randomMemberIndex = Math.floor(
        Math.random() * remainingMembers.length
      );
      const newCreator = remainingMembers[randomMemberIndex];
      chat.creator = newCreator;
    }

    // Remove the user from the members array
    chat.members = chat.members.filter(
      (member) => member.toString() !== req.user.toString()
    );

    // Get user's name for emitting events
    const user = await User.findById(req.user, "name");

    await chat.save();

    console.log(`${user.name} has left the group`);
    // Emitting events
    emitEvent(req, ALERT, chat.members, {
      chatId,
      message: `${user.name} has left the group`,
    });
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res
      .status(201)
      .json({ success: true, message: "Leaved Group Successfully!!" });
  } catch (error) {
    next(error);
  }
};

export const sendAttachments = async (req, res, next) => {
  try {
    const { chatId } = req.body;

    // Check if attachments are provided

    const files = req.files || [];
    if (files.length < 1)
      return res.status(400).json({ message: "Please provide attachments" });

    if (files.length > 5)
      return res.status(400).json({ message: "files can't be more than 5" });

    // Find the chat and the current user
    const chat = await Chat.findById(chatId);
    const me = await User.findById(req.user, "name avatar");

    // Check if the chat exist
    if (!chat) return res.status(400).json({ message: "Chat not found" });

    if (files.length < 1)
      return res.status(400).json({ message: "Please provide attachments" });

    console.log("files = ", files);
    const attachments = await uploadFilesToCloudinary(files);

    console.log("attachements = ", attachments);

    // Prepare message object for database
    const messageForDb = {
      content: "", // You may add content if necessary
      attachments,
      sender: me._id,
      chat: chatId,
    };

    // Prepare message object for real-time messaging with sender details
    const messageForRealTime = {
      ...messageForDb,
      sender: {
        _id: me._id,
        name: me.name,
        avatar: me.avatar.url,
      },
    };

    // Save message to the database
    const message = await Message.create(messageForDb);

    // Emit events for real-time messaging
    emitEvent(req, NEW_MESSAGE, chat.members, {
      message: messageForRealTime,
      chatId,
    });

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

    return res.status(201).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

export const getChatDetails = async (req, res) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();

    if (!chat) return res.status(400).json({ message: "Chat not found" });

    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({ success: true, chat });
  } else {
    const chat = await Chat.findById(req.params.id);

    if (!chat) return res.status(400).json({ message: "Chat not found" });

    return res.status(200).json({ success: true, chat });
  }
};

export const renameGroup = async (req, res) => {
  const chatId = req.params.id;
  const { name } = req.body;
  const chat = await Chat.findById(chatId);

  if (!chat) return res.status(400).json({ message: "Chat not found" });

  if (!chat.groupChat)
    return res.status(400).json({ message: "This is not a group chat" });

  if (chat.creator.toString() !== req.user.toString())
    return "u r not allowed to rename this grp";

  chat.name = name;
  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res
    .status(200)
    .json({ success: true, message: "group name changed succesfully" });
};

export const deleteGroup = async (req, res) => {
  try {
    const chatId = req.params.id;
    console.log("chatid", chatId);

    // Validate chatId to ensure it's a valid ObjectId
    if (!ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    const chat = await Chat.findById(chatId);
    console.log("chat = ", chat);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" }); // Return a response instead of empty string
    }

    const members = chat.members;

    if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this group" }); // Return a response instead of string
    }

    const messagesWithAttachments = await Message.find({
      chat: chatId,
      attachments: { $exists: true, $ne: [] }, // Corrected syntax for existence and non-empty check
    });

    const public_ids = [];

    messagesWithAttachments.forEach((message) => {
      message.attachments.forEach((attachment) => {
        public_ids.push(attachment.publicId); // Corrected property name
      });
    });

    console.log("public ids = ", public_ids);
    await deleteFilesFromCloudinary(public_ids);
    await chat.deleteOne();
    await Message.deleteMany({ chat: chatId });

    emitEvent(req, REFETCH_CHATS, members);

    return res
      .status(200)
      .json({ success: true, message: "Group deleted successfully" }); // Return a success message
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server errorzz" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const chatId = req.params.id;
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    //if we r not user of the group than we must not able to see the cahts even if we hv chatID with us
    const chat = await Chat.findById(chatId);

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (!chat.members.includes(req.user.toString()))
      return res
        .status(404)
        .json({ message: "You are not allowed to access this chat" });

    const [messages, totalMessageCount] = await Promise.all([
      Message.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "name avatar")
        .lean(),
      Message.countDocuments({ chat: chatId }),
    ]);

    const totalPages = Math.ceil(totalMessageCount / limit);
    return res
      .status(200)
      .json({ success: true, messages: messages.reverse(), totalPages });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
