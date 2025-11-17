import {DataTypes} from 'sequelize';
import {sequelize} from '../config/db.js';


export const Boxes=sequelize.define('Boxes',{
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
    },
    species_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
},{
    tableName:'Boxes'
})
