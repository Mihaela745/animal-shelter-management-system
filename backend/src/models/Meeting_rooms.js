import {DataTypes} from 'sequelize';
import {sequelize} from '../config/db.js';

export const Meeting_rooms = sequelize.define('Meeting_roomss', {
    appointment_id:{
        type: DataTypes.INTEGER,
        references:{
            model: 'Appointmentss',
            key: 'id'
        }, allowNull: false
    },
    room_id:{
        type:DataTypes.INTEGER,
        references:{
            model:'Rooms',
            key:'id',},
        allowNull: false,
    },
    start_hour:{
        type:DataTypes.TIME,
        allowNull:false,
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false,    
    }
},{
    tableName:'Meeting_rooms'
});

