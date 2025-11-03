import {sequelize} from '../config/db.js'
import {Animals} from './Animals.js'
import { Species } from './Species.js';
import {Boxes} from './Boxes.js'
import { Medical_files } from './Medical_files.js';
import { Medications } from './Medications.js';
import { Staff } from './Staff.js';
import { Position } from './Position.js';
import { Responsible_box } from './Responsible_box.js';
import { Meeting_rooms } from './Meeting_rooms.js';
import { Rooms } from './Rooms.js';
import { Users } from './Users.js';
import { Appointments } from './Appointments.js';
import { Adoption_history } from './Adoption_history.js';
import {association} from './association.js'

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