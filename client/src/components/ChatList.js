import React from 'react'
import ChatItem from './ChatItem' 

const ChatList = ({chats=[],chatId,onlineUsers=[],newMessagesAlert=[{ chatId:'',count:0, }],handleDeleteChat }) => { 
    const isOnline = true;
  return (
    <div className='w-full h-full'>
        {
            chats.map((data,index)=>{
                const { avatar , _id ,name , groupChat , members } =data ; 
               return (
                <ChatItem avatar={avatar}  _id={_id} name={name}  groupChat={groupChat}  members={members} sameSender={chatId === _id} key={ _id } isOnline={isOnline}/>
               )  
        })
        }
    </div>
  )
}

export default ChatList