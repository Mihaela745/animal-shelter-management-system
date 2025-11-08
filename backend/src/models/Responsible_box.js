import {DataTypes} from 'sequelize';
import {sequelize} from '../config/db.js';

export const Responsible_box=sequelize.define('Resposible_box',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },box_id:
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
},{
    tableName:'Responisible_boxes'
});