import React, { useState } from 'react';
import { FaRegBell } from "react-icons/fa"; 
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';  
import { SampleNotification } from '../utils/SampleNotification';
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
const Notification = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [notifications,setNotifications]= useState(SampleNotification) 
  
  return (
    <>
   
   <FaRegBell className='text-white w-6 h-6' onClick={handleOpen}/>
        
<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
     <h1 className='text-3xl font-semibold text-center mb-3'>Notifications</h1>
      {
       notifications &&(
        notifications.map((x)=>(
            <div key={x._id} className='flex justify-between items-center mt-4 p-3 border-b-[1px] border-gray-300'>
                 <div className='flex gap-5 items-center text-lg'>
                 <img src={x.sender.avatar} alt='jf' className='h-12 w-12 rounded-full object-cover'/>
                <h1>{`${x.sender.name} sends you a Request`}</h1>
                 </div> 
                 <div className='flex items-center gap-3'>
                    <TiTick className='h-10 w-10 text-green-700'/>
                    <RxCross2 className='h-10 w-10 text-red-600'/>
                 </div>
            </div>
        ))
       )  
     }
  
  </Box>
   
</Modal>
    </>
  )
}
   

export default Notification