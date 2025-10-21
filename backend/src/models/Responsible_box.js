const {Sequelize,DataTypes}=require('sequelize');
const sequelize=require('../config/db');

const Responsible_box=sequelize.define('Resposible_box',{
    box_id:
    {
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'Boxes',
            key:'id'
        }
    },
    responsible_id:
    {
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'Staff',
            key:'id'
        }}
});

module.exports=Responsible_box;