import {DataTypes} from 'sequelize';
import {sequelize} from '../config/db.js';


export const Animals=sequelize.define('Animals',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    species_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'Species',
            key:'id'}
    },
    breed:{
        type:DataTypes.STRING,
        allowNull:true
    },
    age:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    gender:{
        type:DataTypes.ENUM('Male','Female'),
        allowNull:false
    },
    box_id:{
        type:DataTypes.INTEGER,
        allowNull:true,
        references:{
            model:'Boxes',
            key:'id'
        }
    },
    medical_file_id:{
        type:DataTypes.INTEGER,
        allowNull:true,
        references:{
            model:'Medical_files',
            key:'id'
        }
    },
    status:{
        type:DataTypes.ENUM('Available','Adopted','Fostered','Pending'),
        defaultValue:'Available'
    }
},{
    tableName:'Animals'
})
