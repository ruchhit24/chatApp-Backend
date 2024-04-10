 import nodemailer from 'nodemailer'

export const generateOtp = ()=>{
    let otp= ''
  for(let i=0;i<4;i++){
    let randVal = Math.round(Math.random()*9)
    otp = otp + randVal
  }
  return otp
}
export const mailTransport = ()=>  nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "process.env.MAILTRAP_USERNAME",
          pass: "process.env.MAILTRAP_PASSWORD"
        }
      });