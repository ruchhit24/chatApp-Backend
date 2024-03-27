import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";

   
const getBase64 = (file) =>
`data:${file.mimetype};base64,${file.buffer.toString("base64")}`;


export const deleteFilesFromCloudinary= (public_ids)=>{
console.log("files deleted")
}

export const getSockets = (users = [])=>{
    const sockets = users.map((user) => userSocketIds.get(user._id.toString()));
    return sockets 
   }


export const uploadFilesToCloudinary = async (files = []) => {
      const uploadPromises = files.map((file) => {
       return new Promise((resolve, reject) => {
         cloudinary.uploader.upload(
           getBase64(file),
           {
             resource_type: "auto",
             public_id: uuid(),
           },
           (error, result) => {
             if (error) return reject(error);
             resolve(result);
           }
         );
       });
     });
   
     try {
       const results = await Promise.all(uploadPromises);
   
       const formattedResults = results.map((result) => ({
         public_id: result.public_id,
         url: result.secure_url,
       }));
       return formattedResults;
     } catch (err) {
       throw new Error("Error uploading files to cloudinary", err);
     }
   };