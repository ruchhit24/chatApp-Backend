import React, { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material'; 
import { SampleUser } from '../utils/SampleUser';
import { IoIosAddCircle } from "react-icons/io";
import { useInputValidation } from '6pp';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
  };

const NewGroup = () =>{
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [users,setUsers]= useState(SampleUser)
    const searchValue = useInputValidation('');
    console.log(users)
  return (
    <>
    <IoMdAdd className='text-white w-6 h-6' onClick={handleOpen}/>
        
<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
     <h1 className='text-3xl font-semibold text-center mb-3'>New Group</h1>
     
     <input type='text' value={searchValue.value} placeholder='Group Name' onChange={searchValue.changeHandler} className='border border-gray-500 w-full p-2 text-black rounded-lg'/>
     <h1 className='pt-2 text-lg font-semibold'>Members</h1>
     {
       users &&( 
        users.map((user)=>(
            <div key={user._id} className='flex justify-between items-center mt-4 p-3 border-b-[1px] border-gray-300'>
                  
                 <div className='flex gap-5 items-center text-lg'>
                 <img src={user.avatar} alt='jf' className='h-12 w-12 rounded-full object-cover'/>
                <h1>{user.name}</h1>
                 </div>
                <IoIosAddCircle className='text-cyan-500 w-7 h-7'/>
            </div>
        ))
       )  
     }
     <div className='flex justify-between p-4'>
        <button className='px-4 py-2 text-red-600 hover:text-white border-2 border-red-600 hover:border-white rounded-md text-base font-semibold cursor-pointer hover:bg-red-600'>Cancel</button>
        <button className='px-4 py-2 bg-cyan-500 text-white rounded-md text-base font-semibold cursor-pointer'>Create</button>
     </div>
  
  </Box>
   
</Modal>
    </>
  )
}

 

export default NewGroup