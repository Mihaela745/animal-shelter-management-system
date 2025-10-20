const{Sequrlize,DataTypes}=requeire('sequelize');
const sequelize=require('../config/db');

const Adoption=sequelize.define('Adoption_history',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    animal_id:{
        type:DataTypes.INTEGER,
        references:{
            model:'Animals',
            key:'id'
        },
        allowNull:false
    },
    adopter_id:{
        type:DataTypes.INTEGER,
        references:{
            model:'Users',
            key:'id'
        },
        allowNull:false
    },
    adoption_date:{
        type:DataTypes.DATE,
        allowNull:false
    },
})

module.exports=Adoption;