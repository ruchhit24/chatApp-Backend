import React, { useEffect } from "react";
import Header from "./Header";
import ChatList from "./ChatList"; 
import Profile from "./Profile"; 
import { useMyChatsQuery } from "../redux/api/api";
import { Skeleton } from "@mui/material";
import { useParams } from "react-router-dom"; 
import { toast } from "react-hot-toast";
import { useSocket } from "../socket";
import Chat from "../pages/Chat";
 

const AppLayout = (props) => { // Removed the higher-order component wrapper
   
  const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
  
  const params = useParams();
  const { chatId } = params;

  // console.log('chatid',chatId)
  // console.log('data = ',data)

  const socket = useSocket();
  // console.log('socket',socket)
  //  console.log('socket id = ',socket.id)

  useEffect(() => {
    if(isError) toast.error(error?.data?.mesage || 'something went wrong');
 },[isError,error])

  const handleDeleteChat = (e, _id, groupChat) => {
    e.preventDefault();
    console.log(`clicked groupchat ${groupChat} and id = ${_id}`);
  };
  
  return (
    <div className="w-full min-h-screen relative">
      <Header />
      <div className="grid grid-cols-12 h-[91vh]">
        <div className="col-span-3 overflow-y-scroll h-[91vh]">
           {isLoading ? (
            <Skeleton />
          ) : (
            <ChatList
              chats={data?.transformedChats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
            />
          )}
        </div>
        <div className="col-span-5 bg-gray-200 h-[91vh]">
        {props.children} 
        </div>
        <div className="col-span-4 bg-zinc-800 h-[91vh]">
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
