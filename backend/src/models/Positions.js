const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Position=sequelize.define('Position',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:true
    }
})

module.exports=Position;