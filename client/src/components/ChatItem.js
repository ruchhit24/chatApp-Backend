import React, { memo } from 'react'
import {Link} from 'react-router-dom'

const ChatItem = ({ avatar,name,_id, groupChat=false ,sameSender ,isOnline=true , newMessageAlert , index=0 ,handleDeleteChat}) => {
  return (
    <Link to={`/chat/${_id}`} onContextMenu={(e)=>handleDeleteChat(e,_id,groupChat)}>
        <div className='p-3 border-b-[1px] border-gray-400 flex items-center gap-3 hover:bg-gray-300'>
            <img src={avatar} alt='dj' className='w-12 h-12 object-cover rounded-full '/>
            <div className='flex justify-between items-center'>
                <h2>{name}</h2>
                {
                    newMessageAlert && (
                        <h2>{newMessageAlert.count} New Message</h2>
                    )
                }
                 
            </div>
            {
                    isOnline && (
                        <div className='h-2 w-2 rounded-full bg-green-800'/>
                    )
                }
        </div>
    </Link>
  )
}

export default memo(ChatItem)