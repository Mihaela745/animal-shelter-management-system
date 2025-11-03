import {DataTypes} from 'sequelize';
import {sequelize} from '../config/db.js';
export const Position=sequelize.define('Position',{
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
},{
    tableName:'Positions'
})