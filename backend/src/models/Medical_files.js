const{Seqeulize,DataTypes}=require('sequelize');
const sequelize=require('../config/db');

const Medical_files=sequelize.define('Medical_files',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    weight:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    last_checkup_date:{
        type:DataTypes.DATE},
        general_observations:{
            type:DataTypes.TEXT,
            allowNull:true
        }
})


module.exports=Medical_files;