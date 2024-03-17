import moment from "moment";
import { fileFormat } from "../lib/Features";
import RenderAttachment from "./RenderAttachment";
import zIndex from "@mui/material/styles/zIndex";

const MessageComponent = ({ message, user }) => {
    const { sender, content, attachments = [], createdAt } = message;
    const sameSender = sender._id === user._id;
    const messageClass = sameSender ? 'self-end' : 'self-start';
    
const timeAgo= moment(createdAt).fromNow()

    return (
      <div className={`${messageClass} pr-8 pl-2 py-2 rounded-lg bg-gray-300 mt-2`} >
        {
            !sameSender && (
                <h2 className="capitalize font-bold">{sender.name}</h2>
            )
        }
        {
            content && (
                <div>{content}</div>
            )
        }
        {
            attachments.length > 0 && (
                attachments.map((attachement,index)=>{
                    const url = attachement.url;
                    const file=fileFormat(url);
                    return <div key={index}>
                        <a href={url} target="_blank" download className="bg-black" >
                            <RenderAttachment file={file} url={url}/>
                        </a>
                    </div>
                })
            )
        }
        <h2 className="text-xs text-gray-600">{timeAgo}</h2>
      </div>
    );
  };
  
  export default MessageComponent;
  