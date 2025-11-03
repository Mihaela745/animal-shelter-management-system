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

Animals.belongsTo(Species,{foreignKey:'species_id'});
Species.hasMany(Animals,{foreignKey:'species_id'});

Animals.belongsTo(Boxes,{foreignKey:'box_id'});
Boxes.hasMany(Animals,{foreignKey:'box_id'});

Medications.belongsTo(Medical_files,{foreignKey:'medical_file_id'});
Medical_files.hasMany(Medications,{foreignKey:'medical_file_id'});

Medications.belongsTo(Staff,{foreignKey:'prescribing_vet'});
Staff.hasMany(Medications,{foreignKey:'prescribing_vet'});

Staff.belongsTo(Position,{foreignKey:'position_id'});
Position.hasMany(Staff,{foreignKey:'position_id'});

Animals.belongsTo(Medical_files,{foreignKey:'medical_file_id'});
Medical_files.hasOne(Animals,{foreignKey:'medical_file_id'});

Users.belongsToMany(Animals,{through:Adoption_history,foreignKey:'adopter_id'});
Animals.belongsToMany(Users,{through:Adoption_history,foreignKey:'animal_id'});

Staff.belongsToMany(Boxes, { through: Responsible_box, foreignKey: 'responsible_id' });
Boxes.belongsToMany(Staff, { through: Responsible_box, foreignKey: 'box_id' });

Appointments.belongsTo(Users, { foreignKey: 'user_id' });
Appointments.belongsTo(Staff, { foreignKey: 'staff_id' });
Appointments.belongsTo(Animals, { foreignKey: 'animal_id' });

Users.hasMany(Appointments, { foreignKey: 'user_id' });
Staff.hasMany(Appointments, { foreignKey: 'staff_id' });
Animals.hasMany(Appointments, { foreignKey: 'animal_id' });

Rooms.belongsToMany(Appointments,{through:Meeting_rooms,foreignKey:'room_id'});
Appointments.belongsToMany(Rooms,{through:Meeting_rooms,foreignKey:'appointment_id'});

