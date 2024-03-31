import React, { useCallback, useEffect } from "react";
import Header from "./Header";
import ChatList from "./ChatList"; 
import Profile from "./Profile"; 
import { useMyChatsQuery } from "../redux/api/api";
import { Skeleton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom"; 
import { toast } from "react-hot-toast";
import { useSocket } from "../socket";
import Chat from "../pages/Chat";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from "../constants/events";
import { useDispatch, useSelector } from "react-redux";
import { incrementNotification, setNewMessagesAlert } from "../redux/reducers/chat";
import { saveToLocalStorage } from "../lib/Features";
 

const AppLayout = (props) => { // Removed the higher-order component wrapper
   
  const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
  
  const params = useParams();
  const { chatId } = params;

  const dispatch  = useDispatch() 

  const { newMessagesAlert } = useSelector((state) => state.chat);

  // console.log('chatid',chatId)
  console.log('data = ',data)

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

  const newRequestListener = useCallback(() => {
    dispatch(incrementNotification());
  }, [dispatch]);

  useEffect(() => { 
    socket.on(NEW_REQUEST,newRequestListener);
    return () => { socket.off(NEW_REQUEST,newRequestListener); };
 } , [] );

 const newMessageAlertListener = useCallback(
  (data) => {
    if (data.chatId === chatId) return;
    dispatch(setNewMessagesAlert(data));
  },
  [chatId]
);
useEffect(() => { 
  socket.on(NEW_MESSAGE_ALERT,newMessageAlertListener);
  return () => { socket.off(NEW_MESSAGE_ALERT,newMessageAlertListener); };
} , [chatId] );

useEffect(() => {
  saveToLocalStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
}, [newMessagesAlert]);

const refetchListener= useCallback(() => {
  refetch();   
}, [refetch]);
useEffect(() => { 
  socket.on(REFETCH_CHATS,refetchListener);
  return () => { socket.off(REFETCH_CHATS,refetchListener); };
} , [refetch] );
  
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
              newMessagesAlert={newMessagesAlert}
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
