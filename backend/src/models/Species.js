const { Sequelize,DataTypes } = require("sequelize")
const sequlize=requeire("../config/db")

const species=sequlize.define('Species',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true},
    name:{
        type:DataTypes.STRING,
        allowNull:false}
    })

module.exports=species;