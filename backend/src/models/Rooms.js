import {DataTypes} from 'sequelize';
import {sequelize} from '../config/db.js';

export const Rooms=sequelize.define('Rooms',{
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
},{
    tableName:'Rooms'
});
