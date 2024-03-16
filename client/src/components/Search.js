import React, { useState } from 'react'
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import { IoSearchSharp } from "react-icons/io5";
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
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  

const Search = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [users,setUsers]= useState(SampleUser)
    const searchValue = useInputValidation('');
    console.log(users)
  return (
    <>
    <IoSearchSharp className='text-white w-6 h-6' onClick={handleOpen}/>
        
<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
     <h1 className='text-3xl font-semibold text-center mb-3'>Find People</h1>
     <input type='text' value={searchValue.value} onChange={searchValue.changeHandler} className='border w-full p-2 text-black rounded-lg'/>
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
  
  </Box>
   
</Modal>
    </>
  )
}

export default Search