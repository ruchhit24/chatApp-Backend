import React, { useRef, useState } from "react";
import AppLayout from "../components/AppLayout";
import { CgAttachment } from "react-icons/cg";
import { IoMdSend } from "react-icons/io";
import { SampleMessage } from "../utils/SampleMessage";
import MessageComponent from "../components/MessageComponent";
import { useSocket } from "../socket";
import { NEW_MESSAGE } from "../constants/events";
import { useChatDetailsQuery } from "../redux/api/api";
import { Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";

const user = {
  _id : 'yooKiId',
  name : 'yoo',
}

const Chat = () => {

  const params = useParams();
  const { chatId } = params;

  console.log('chatid',chatId)


  const containerRef = useRef(null);

  console.log("Chat ID:", chatId);

  const socket = useSocket();
  const [message, setMessage] = useState("");

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log('message =',message);

    if (!message.trim()) return;

    // Emitting the message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };
  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <AppLayout>
        <div ref={containerRef} className="flex flex-col h-full">
        <div className="flex-1 flex flex-col p-3 ">
          {SampleMessage.map((msg) => (
            <MessageComponent message={msg} user={user} key={msg._id} />
          ))}
        </div>
        <div className="p-3 bg-gray-300">
          <form className="flex items-center" onSubmit={submitHandler}>
            <CgAttachment className="w-8 h-8 mr-2" />
            <input
              placeholder="Type some message here.."
              value={message}
              onChange={messageOnChange}
              className="flex-1 p-2 border border-gray-400 rounded-lg"
            />
            <IoMdSend type="submit" className="w-8 h-8 ml-2" />
          </form>
        </div>
      </div>
    </AppLayout>
      
       
     
  );
};

export default Chat;
