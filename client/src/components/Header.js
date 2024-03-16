import React from 'react'  
import { FaUserGroup } from "react-icons/fa6"; 
import { PiSignOutBold } from "react-icons/pi";
import Search from './Search';
import Notification from './Notification';
import NewGroup from './NewGroup';


const Header = () => { 

  return (
    <div className='text-3xl bg-gray-800 py-8 static px-8 flex justify-between'>
      <div>
        <h2 className='text-white text-xl'>ChatApp</h2>
      </div>
      <div className='flex gap-8 items-center'>
          <Search/>
          <NewGroup/>
         <FaUserGroup className='text-white w-6 h-6'/>
          <Notification/>
         <PiSignOutBold className='text-white w-6 h-6'/>
         
      </div>
    </div>
  )
}

export default Header