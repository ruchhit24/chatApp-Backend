import { faker, simpleFaker } from "@faker-js/faker";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export const createSingleChats = async (chatsCount) => {
    try {
      const users = await User.find().select("_id");
      const chatPromises = [];
      for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
          chatPromises.push(
            Chat.create({
              name: faker.lorem.words(2),
              members: [users[i], users[j]],
            })
          );
        }
      }
      await Promise.all(chatPromises);
      console.log('Chats created successfully');
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  export const createGroupChats = async (chatsCount) => {
    try {
      const users = await User.find().select("_id");
      const chatPromises = [];
      for (let i = 0; i < chatsCount; i++) {
        const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
        const members = [];
  
        for (let j = 0; j < numMembers; j++) {
          const randomIndex = Math.floor(Math.random() * users.length);
          const randomUser = users[randomIndex];
          if (!members.includes(randomUser)) {
            members.push(randomUser);
          }
        }
  
        const chat = await Chat.create({
          groupChat: true,
          name: faker.lorem.words(1),
          members,
          creator: members[0],
        });
        chatPromises.push(chat);
      }
  
      await Promise.all(chatPromises);
      console.log('Chats created successfully');
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  export const createMessages = async (numMessages) => {
    try {
      const users = await User.find().select("_id");
      const chats = await Chat.find().select("_id");
      const messagePromises = [];
  
      for (let i = 0; i < numMessages; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomChat = chats[Math.floor(Math.random() * chats.length)];
  
        messagePromises.push(
          Message.create({
            chat: randomChat,
            sender: randomUser,
            content: faker.lorem.sentence(),
          })
        );
      }
  
      await Promise.all(messagePromises);
      console.log('Messages created successfully');
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  export const createMessageInChat = async (chatId, numMessages) => {
    try {
      const users = await User.find().select("_id");
      const messagePromises = [];
  
      for (let i = 0; i < numMessages; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
  
        messagePromises.push(
          Message.create({
            chat: chatId,
            sender: randomUser,
            content: faker.lorem.sentence(),
          })
        );
      }
  
      await Promise.all(messagePromises);
      console.log('Messages created successfully');
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
        