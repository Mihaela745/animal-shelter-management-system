const Animals=require('./Animals');
const Species=require('./Species');
const Boxes=require('./Boxes');
const Medical_files = require('./Medical_files');
const Medications = require('./Medications');
const Staff = require('./Staff');
const Position = require('./Position');
const Responsible_box = require('./Responsible_box');
const Meeting_rooms = require('./Meeting_rooms');
const Rooms = require('./Rooms');
const Users = require('./Users');
const Appointments = require('./Appointments');
const Adoption_history = require('./Adoption_history');

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

