import { isValidUsername } from "6pp";

export const usernameValidator = (username)=>{
    if(!isValidUsername(username))
     return { isVaild : false , errorMessage : "Username is Not Valid!!"}
}