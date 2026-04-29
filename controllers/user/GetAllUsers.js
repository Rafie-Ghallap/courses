const { usersModel } = require("../../models/users/users")

const getAllUsers=async (req, res)=>{
    try{
        let users=await usersModel.find({"role":{$in:["instructor","student"]}},"firstName username email role ");
        if(!users.length){
            return res.status(404).json({message:"no users registered yet ..."});
        }

        res.status(200).json({users})
    }catch(error){
        res.status(500).json({message:"internal server error", error})
    }
}

module.exports= {getAllUsers}