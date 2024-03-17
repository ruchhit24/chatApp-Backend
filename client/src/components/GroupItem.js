import React from 'react'
import { Link } from 'react-router-dom'

const GroupItem = ({group , chatId}) => {

    const { name , avatar ,_id } = group
  return (
    <Link to={`?group=${_id}`} onClick={(e)=>{ if(chatId === _id) e.preventDefault()}} >
    <div className='p-3 border-b-[1px] border-gray-400 flex items-center justify-between gap-3 hover:bg-gray-300'>
        <div className='flex items-center gap-3'>
        <img src={avatar} alt='dj' className='w-12 h-12 object-cover rounded-full '/>
        <div className='flex justify-between items-center'>
            <h2>{name}</h2>
    
        </div>
        </div>
       
    </div>
</Link>
  )
}

export default GroupItem