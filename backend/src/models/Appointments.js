import {DataTypes} from 'sequelize';
import {sequelize} from '../config/db.js';


export const Appointments = sequelize.define('Appointments', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        references:{
            model: 'Users',
            key: 'id'
        },
        allowNull: false
    },
    staff_id:{
        type: DataTypes.INTEGER,
        references:{
            model: 'Staff',
            key: 'id'
        },
        allowNull: false
    },
    animal_id:{
        type: DataTypes.INTEGER,
        references:{
            model: 'Animals',
            key: 'id'
        },
        allowNull: false
    }
},{
    tableName:'Appointments'
});
