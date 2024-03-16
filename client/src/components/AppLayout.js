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
      <>
        <Header />
        <div className="grid grid-cols-12  min-h-screen">
          <div className="col-span-3">
            <ChatList
              chats={SampleData}
              chatId={'1'}
              newMessageAlert={[{ chatId : 1, count: 4 }]}
              handleDeleteChat={handleDeleteChat}
            />
          </div>
          <div className="col-span-5 bg-slate-600"></div>
          <div className="col-span-4 bg-zinc-800">
            <Profile/>
          </div>
        </div>
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default AppLayout;
