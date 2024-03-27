import React, { useEffect } from "react";
import Header from "./Header";
import ChatList from "./ChatList"; 
import Profile from "./Profile"; 
import { useMyChatsQuery } from "../redux/api/api";
import { Skeleton } from "@mui/material";
import { useParams } from "react-router-dom"; 
import { toast } from "react-hot-toast";

const AppLayout = (props) => { // Removed the higher-order component wrapper
  
  const params = useParams();
  const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
  const chatId = params.chatId;

  useEffect(() => {
    if(isError) toast.error(error?.data?.mesage || 'something went wrong');
 },[isError,error])

  const handleDeleteChat = (e, _id, groupChat) => {
    e.preventDefault();
    console.log(`clicked groupchat ${groupChat} and id = ${_id}`);
  };
  
  return (
    <div className="w-full h-[100vh] relative">
      <Header />
      <div className="grid grid-cols-12 h-[91vh]">
        <div className="col-span-3 overflow-y-scroll">
           {isLoading ? (
            <Skeleton />
          ) : (
            <ChatList
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
            />
          )}
        </div>
        <div className="col-span-5 bg-gray-200">
          {props.children} {/* Render the WrappedComponent */}
        </div>
        <div className="col-span-4 bg-zinc-800">
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
