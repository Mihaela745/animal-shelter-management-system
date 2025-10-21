const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = require('../config/db');

const Boxes=sequelize.define('Boxes',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    box_number:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    capacity:{
        type:DataTypes.INTEGER,
        allowNull:false},
    current_occupancy:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    }
})

module.exports=Boxes;