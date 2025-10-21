const {Sequelize, DataTypes}=require('sequelize');
const sequelize=require('../config/db');

const Rooms=sequelize.define('Rooms',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    room_number:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    }
});

module.exports=Rooms;