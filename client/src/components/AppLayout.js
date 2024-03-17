import React from "react";
import Header from "./Header";
import ChatList from "./ChatList"; 
import {SampleData} from '../utils/SampleData'
import Profile from "./Profile";
 

const AppLayout = () => (WrappedComponent) => {
  return (props) => {

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log(`clicked groupchat ${groupChat} and id = ${_id}`);
    };
    return (
      <div className="w-full h-[100vh] relative">
        <Header />
        <div className="grid grid-cols-12 h-[91vh]">
          <div className="col-span-3 overflow-y-scroll">
            <ChatList
              chats={SampleData}
              chatId={'1'}
              newMessageAlert={[{ chatId : 1, count: 4 }]}
              handleDeleteChat={handleDeleteChat}
            />
          </div>
          <div className="col-span-5 bg-gray-200">
          <WrappedComponent {...props} />
          </div>
          <div className="col-span-4 bg-zinc-800">
            <Profile/>
          </div>
        </div>
        
      </div>
    );
  };
};

export default AppLayout;
