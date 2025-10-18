const {Sequelize} = require('sequelize');

const sequelize=new Sequelize('animal_shelter','root','07Toni04..',{
    host:'localhost',
    dialect:'mysql'
})

module.exports=sequelize;