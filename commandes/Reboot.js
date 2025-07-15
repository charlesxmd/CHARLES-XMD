
const {zokou}=require("../framework/zokou")







zokou({nomCom:"restart",categorie:"Mods",reaction:"📴"},async(dest,z,com)=>{


  
const{repondre,ms,dev,superUser}=com;

  if(!superUser)
  {
    return repondre("This command is for owner only");
  }

  const {exec}=require("child_process")

    repondre("CHARLES-XMD bot Restarting be cool.Thanks for choosing toxic ©Charleske-xmd⏳");

  exec("pm2 restart all");
  

  



})
