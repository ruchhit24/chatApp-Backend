import React, { useState } from 'react';
import { FaRegBell } from "react-icons/fa"; 
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';  
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../redux/api/api';
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { setIsNotification } from '../redux/reducers/misc';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { resetNotificationCount } from '../redux/reducers/chat';

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

  const dispatch = useDispatch();
  
  const { isNotification } = useSelector((state) => state.misc);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const { isLoading, data, error, isError } = useGetNotificationsQuery();
   console.log('notification ka data = ',data)

   const [acceptRequest] = useAcceptFriendRequestMutation();
  
   const friendRequestHandler = async ({ idd, accept }) => {
    dispatch(setIsNotification(false));
     try{
      const res = await acceptRequest({requestId : idd,accept})
      console.log('res= ',res);
      if (res.data?.success) {
        console.log("we need to use sockets here");
        toast.success(res.data.message);
         
      } else {
        toast.error(res.error.data.message || "Something went wrong");
      }
  }
catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }
  const openNotification = () => {
    dispatch(setIsNotification(true)); 
    dispatch(resetNotificationCount());
  };


  
  const closeHandler = () => dispatch(setIsNotification(false));
    return (
        <>
            <FaRegBell className='text-white w-6 h-6'  onClick={openNotification}/>
                
            <Modal
                open={isNotification}
                onClose={closeHandler}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h1 className='text-3xl font-semibold text-center mb-3'>Notifications</h1>
                    {isError && <div>Error: {error.message}</div>}
                    {isLoading && <div>Loading...</div>}
                    {data && (
                        data?.requests?.length > 0 ? (
                            data?.requests.map((x) => (
                                <div key={x._id} className='flex justify-between items-center mt-4 p-3 border-b-[1px] border-gray-300'>
                                    <div className='flex gap-5 items-center text-lg'>
                                        <img src={x.sender.avatar} alt='jf' className='h-12 w-12 rounded-full object-cover'/>
                                        <h1>{`${x.sender.name} sends you a Request`}</h1>
                                    </div> 
                                    <div className='flex items-center gap-3'>
                                    <TiTick className='h-10 w-10 text-green-700' onClick={()=> friendRequestHandler({ idd : x._id , accept : true})}/>
                                   <RxCross2 className='h-10 w-10 text-red-600' onClick={()=> friendRequestHandler({ idd : x._id , accept : false})}/>
                                    </div>
                                </div>
                            ))
                        ) : <div>No notifications</div>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default Notification;
