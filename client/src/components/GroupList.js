import React from 'react'
import GroupItem from './GroupItem'

const GroupList = ({ myGroups=[] , chatId }) => {
  return (
    <div>
     {
        myGroups.length > 0 ? (
            myGroups.map((group,index) => <GroupItem group={group} chatId={chatId} key={group._id} index/>)
        ) : (<p>No Groups</p>) 
     }
    </div>
  )
}

export default GroupList