import React, { useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../components/AppLayout";
import { CgAttachment } from "react-icons/cg";
import { IoMdSend } from "react-icons/io";
// import { SampleMessage } from "../utils/SampleMessage";
import MessageComponent from "../components/MessageComponent";
import { useSocket } from "../socket";
import { NEW_MESSAGE } from "../constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useInfiniteScrollTop } from "6pp";
import FileMenu from "../components/FileMenu";
import { setIsFileMenu } from "../redux/reducers/misc";

// const user = {
//   _id : 'yooKiId',
//   name : 'yoo',
// }

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  // console.log('user= ',user)

  const params = useParams();
  const { chatId } = params;

  // console.log('chatid',chatId)


  const containerRef = useRef(null);
  const dispatch = useDispatch()
 

  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

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

  const newMessageHandler = useCallback((data) => { 
      console.log(data);
      setMessages((prev) => [...prev, data.message]);
    } ,[] );

useEffect(() => { 
   socket.on(NEW_MESSAGE,newMessageHandler);
   return () => { socket.off(NEW_MESSAGE,newMessageHandler); };
} , [] );

const [page, setPage] = useState(1);
const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
console.log(oldMessagesChunk);

const { data , setData } = useInfiniteScrollTop(
  containerRef,
  oldMessagesChunk.data?.totalPages,
  page,
  setPage,
  oldMessagesChunk.data?.messages
);

console.log('old messages',data);

const allMessages = [...data, ...messages];

const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

const handleFileOpen = (e) => {
  dispatch(setIsFileMenu(true));
  setFileMenuAnchor(e.currentTarget);
};


  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <AppLayout>
        <div ref={containerRef} className="flex flex-col h-[91vh] overflow-y-scroll">
        <div className="flex-1 flex flex-col p-3 ">
          {allMessages.map((msg) => (
            <MessageComponent message={msg} user={user} key={msg._id} />
          ))}
        </div>
        <div className="p-3 bg-gray-300">
          <form className="flex items-center" onSubmit={submitHandler}>
            <CgAttachment className="w-8 h-8 mr-2" onClick={handleFileOpen} />
            <input
              placeholder="Type some message here.."
              value={message}
              onChange={messageOnChange}
              className="flex-1 p-2 border border-gray-400 rounded-lg"
            />
            <IoMdSend type="submit" className="w-8 h-8 ml-2" />
          </form>
          <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
        </div>
      </div>
    </AppLayout>
      
       
     
  );
};

export default Chat;
