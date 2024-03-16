import React from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";


const Header = () => {
  return (
    <div className='text-3xl bg-gray-800 py-8 static px-8 flex justify-between'>
      <div>
        <h2 className='text-white text-xl'>ChatApp</h2>
      </div>
      <div className='flex gap-8 items-center'>
         <IoSearchSharp className='text-white w-6 h-6'/>
         <IoMdAdd className='text-white w-6 h-6'/>
         <FaUserGroup className='text-white w-6 h-6'/>
         <FaRegBell className='text-white w-6 h-6'/>
         <PiSignOutBold className='text-white w-6 h-6'/>
         
      </div>
    </div>
  )
}

export default Header