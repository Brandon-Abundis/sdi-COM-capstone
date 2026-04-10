const db = require("../db/db");

const checkIfStillLoggedIn = async (req,res) => {
  const userId = req.signedCookies.userId;

  if(!userId) {return res.status(401).json({message: "no active cookie session!"});}

  try{
    const user = await db("users").where({ id: userId }).first();
    const { password, ...userData } = user;
    res.status(200).json(userData);
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

module.exports = {checkIfStillLoggedIn};