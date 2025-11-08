import { sequelize } from "../config/db.js";

export const controller={
    resetDb:async(req,res)=>{
        try{
            await sequelize.query('SET FOREIGN_KEY_CHECKS=0',{raw:true});
            await sequelize.sync({force:true});
            res.status(200).send({message:'Data base has been reseted!'});
        }
        catch(err){
            console.log(err);
            res.status(500).send({message:`Error on reseting:${err}`})
        }
    }
}