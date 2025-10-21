const { Sequelize,DataTypes } = require("sequelize")
const sequelize=require("../config/db")

const species=sequelize.define('Speciess',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true},
    name:{
        type:DataTypes.STRING,
        allowNull:false}
    })

module.exports=species;