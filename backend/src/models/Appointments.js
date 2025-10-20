const {Seqeulize, DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
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
});