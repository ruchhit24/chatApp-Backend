import React, { useRef } from "react";
import AppLayout from "../components/AppLayout";
import { CgAttachment } from "react-icons/cg";
import { IoMdSend } from "react-icons/io";
import { SampleMessage } from "../utils/SampleMessage";
import MessageComponent from "../components/MessageComponent";

const user = {
  _id: "yooKiId",
  name: "yoo",
};

const Chat = () => {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      <div className="h-full flex">
        {/* {SampleMessage.map((msg) => (
      <MessageComponent message={msg} user={user} key={msg.id} />
    ))} */}
        <div className="w-1/2 bg-green-400 h-full flex-">
          {SampleMessage.map((message, index) => {
            if (message.sender._id !== user._id) {
              return (
                <div key={index} className="message">
                  <p>{message.sender.name}</p>
                  <p>{message.content}</p>
                </div>
              );
            }
            return null; // Skip rendering messages from other senders
          })}
        </div>
        <div className="w-1/2 h-full bg-red-600">
          {SampleMessage.map((message, index) => {
            if (message.sender._id === user._id) {
              return (
                <div key={index} className="message">
                  <p>{message.sender.name}</p>
                  <p>{message.content}</p>
                </div>
              );
            }
            return null; // Skip rendering messages from other senders
          })}
        </div>
      </div>
      <div className="p-3 bg-gray-300">
        <form className="flex items-center">
          <CgAttachment className="w-8 h-8 mr-2" />
          <input
            placeholder="Type some message here.."
            className="flex-1 p-2 border border-gray-400 rounded-lg"
          />
          <IoMdSend type="submit" className="w-8 h-8 ml-2" />
        </form>
      </div>
    </div>
  );
};

export default AppLayout()(Chat);
