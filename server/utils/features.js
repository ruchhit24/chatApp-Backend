export const deleteFilesFromCloudinary= (public_ids)=>{
console.log("files deleted")
}

export const getSockets = (users = [])=>{
    const sockets = users.map((user) => userSocketIds.get(user._id.toString()));
    return sockets 
   }