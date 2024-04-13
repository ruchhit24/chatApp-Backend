import { body, check, validationResult,param} from 'express-validator';


const validateHandler = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors)
    const errorMessages = errors.array().map((error) => error.msg);
    console.log(errorMessages);
    if (errors.isEmpty()) {
        return next();
    } else {
        return res.status(400).json({ success: false, message: errorMessages });
    }
};


const registerValidator = () => [
    body("name", "Please enter your name").notEmpty(),
    body("username", "Please enter your username").notEmpty(),
    body("email", "Please enter your email").notEmpty(),
    body("password", "Please enter your password").notEmpty(),
    body("bio", "Please enter your bio").notEmpty(), 
];

const loginValidator = () => [
    body("username","Please enter you r username").notEmpty() ,
   body("password","Please enter you r password").notEmpty() ,
   ];
   
   const newGroupValidator = () => [
    body("name","Please enter your name").notEmpty() ,
   body("members")
   .notEmpty().withMessage("Please enter members")
   .isArray({min:2,max:100}).withMessage(" members must be bet 2-100")
   ];

   const addMemberValidator = () => [
    body("chatId","Please enter your chatId").notEmpty() ,
   body("members")
   .notEmpty().withMessage("Please enter members")
   .isArray({min:1, max:97}).withMessage(" members must be bet 1-97")
   ];

   const removeMemberValidator = () => [
    body("chatId","Please enter your chatId").notEmpty() ,
   body("userId","Please enter your userId").notEmpty() ,
   ]

   const leaveGroupValidator = () => [

    // make sure jo rouute me 'param' ka nam hoga whi de yha bhi
    
     param("chatId","Please enter your chatId").notEmpty() , 

   ]

   const sendAttachmentsValidator = () => [ 

    body("chatId","Please enter your chatId").notEmpty()
   ]

   const getChatIdValidator = () => [ 

    param("id","Please enter your chatId").notEmpty() , 
   ]

   const renameGroupValidator = () => [ 

    param("id","Please enter your chatId").notEmpty(),
    
    body("name","Please enter name").notEmpty() , 
    ]
    const sendRequestValidator = () => [
        body("userId","please enter user id").notEmpty(),
      ];
      const acceptRequestValidator = () => [
        body("requestId","please enter user id").notEmpty(),
        body("accept").notEmpty().withMessage("please add request").isBoolean
      
      ().withMessage("Acept must be boolean")
      ];


   export{registerValidator,validateHandler,loginValidator,newGroupValidator,addMemberValidator,removeMemberValidator,leaveGroupValidator,sendAttachmentsValidator,getChatIdValidator,renameGroupValidator,sendRequestValidator,acceptRequestValidator}