const{Seqeulize,DataTypes, DataTypes}=require('sequelize');
const sequelize=require('../config/db');

const Medicale_file=sequelize.define('Medical_file',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    weight:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    last_checkup_date:{
        type:DataTypes.DATE},
        general_observations:{
            type:DataTypes.TEXT,
            allowNull:true
        }
})

Medicale_file.hasMany(require('./Medications'),{foreignKey:'medical_file_id'});


module.exports=Medical_file;