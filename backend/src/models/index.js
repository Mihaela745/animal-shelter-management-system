const sequelize = require('../config/db');
const Animals = require('./Animals');
const Species = require('./Species');
const Boxes = require('./Boxes');
const Medical_files = require('./Medical_files');
const Medications = require('./Medicationss');
const Staff = require('./Staff');
const Position = require('./Position');
const Responsible_box = require('./Responsible_box');
const Meeting_rooms = require('./Meeting_roomss');
const Users = require('./Users');
const Appointments = require('./Appointments');
const Rooms = require('./Rooms');
const Adoption_history = require('./Adoption_history');
const association=require('./association');

module.exports = {
    sequelize,
    Animals,
    Species,
    Boxes,
    Medical_files,
    Medications,
    Staff,
    Position,
    Responsible_box,
    Meeting_rooms,
    Users,
    Appointments,
    Rooms,
    Adoption_history,
    association
};