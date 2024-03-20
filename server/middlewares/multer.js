import multer from "multer"
 
export const multerUpload = multer ({
limits : { fileSize : 1024 * 1024 * 5  } });  // 5mb

const AvatarUpload = multerUpload.single("avatar");

const attachments = multerUpload.array("files",5)

export { AvatarUpload , attachments}