import {DataTypes} from 'sequelize';
import {sequelize} from '../config/db.js';

export const Staff=sequelize.define('Staff',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    position_id:{
        type:DataTypes.INTEGER,
        references:{
            model:'Positions',
            key:'id'
        }
    },
    phonenumber:{
        type:DataTypes.STRING,
        allowNull:true
    }
},{tableName:'Staff'});
