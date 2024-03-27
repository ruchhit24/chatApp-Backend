import React, { useRef } from 'react'
import AppLayout from '../components/AppLayout' 
import { CgAttachment } from "react-icons/cg";
import { IoMdSend } from "react-icons/io";
import { SampleMessage } from '../utils/SampleMessage';
import MessageComponent from '../components/MessageComponent';

const user = {
  _id : 'yooKiId',
  name : 'yoo',
}

const Chat = () => {
  const containerRef= useRef(null)
  
  return (
    <AppLayout> {/* No need for wrapping () */}
      <div ref={containerRef} className='flex flex-col h-full'>
        <div className='flex-1 flex flex-col p-3 '>
          {SampleMessage.map((msg) => (
            <MessageComponent message={msg} user={user} key={msg._id} />
          ))}
        </div>
        <div className='p-3 bg-gray-300'>
          <form className='flex items-center'>
            <CgAttachment className='w-8 h-8 mr-2' />
            <input placeholder='Type some message here..' className='flex-1 p-2 border border-gray-400 rounded-lg' />
            <IoMdSend type='submit' className='w-8 h-8 ml-2' />
          </form>
        </div>
      </div>
    </AppLayout>
  )
}

export default Chat;
