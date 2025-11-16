import { Animals } from "./Animals.js";
import { Species } from "./Species.js";
import { Boxes } from "./Boxes.js";
import { Medical_files } from "./Medical_files.js";
import { Medications } from "./Medications.js";
import { Staff } from "./Staff.js";
import { Position } from "./Position.js";
import { Responsible_box } from "./Responsible_box.js";
import { Rooms } from "./Rooms.js";
import { Users } from "./Users.js";
import { Appointments } from "./Appointments.js";
import { Adoption_history } from "./Adoption_history.js";

Animals.belongsTo(Species, { foreignKey: "species_id", onDelete: "CASCADE" });
Species.hasMany(Animals, { foreignKey: "species_id", onDelete: "CASCADE" });
Animals.belongsTo(Boxes, { foreignKey: "box_id", onDelete: "CASCADE" });
Boxes.hasMany(Animals, { foreignKey: "box_id", onDelete: "CASCADE" });

Medications.belongsTo(Medical_files, {
  foreignKey: "medical_file_id",
  onDelete: "CASCADE",
});
Medical_files.hasMany(Medications, {
  foreignKey: "medical_file_id",
  onDelete: "CASCADE",
});

Medications.belongsTo(Staff, {
  foreignKey: "prescribing_vet",
  onDelete: "CASCADE",
});
Staff.hasMany(Medications, {
  foreignKey: "prescribing_vet",
  onDelete: "CASCADE",
});

Staff.belongsTo(Position, { foreignKey: "position_id", onDelete: "CASCADE" });
Position.hasMany(Staff, { foreignKey: "position_id", onDelete: "CASCADE" });

Animals.belongsTo(Medical_files, {
  foreignKey: "medical_file_id",
  onDelete: "CASCADE",
});
Medical_files.hasOne(Animals, {
  foreignKey: "medical_file_id",
  onDelete: "CASCADE",
});

Users.belongsToMany(Animals, {
  through: Adoption_history,
  foreignKey: "adopter_id",
  onDelete: "CASCADE",
});
Animals.belongsToMany(Users, {
  through: Adoption_history,
  foreignKey: "animal_id",
  onDelete: "CASCADE",
});

Staff.belongsToMany(Boxes, {
  through: Responsible_box,
  foreignKey: "responsible_id",
  onDelete: "CASCADE",
});
Boxes.belongsToMany(Staff, {
  through: Responsible_box,
  foreignKey: "box_id",
  onDelete: "CASCADE",
});

Appointments.belongsTo(Users, { foreignKey: "user_id", onDelete: "CASCADE" });
Appointments.belongsTo(Staff, { foreignKey: "staff_id", onDelete: "CASCADE" });
Appointments.belongsTo(Animals, {
  foreignKey: "animal_id",
  onDelete: "CASCADE",
});

Users.hasMany(Appointments, { foreignKey: "user_id", onDelete: "CASCADE" });
Staff.hasMany(Appointments, { foreignKey: "staff_id", onDelete: "CASCADE" });
Animals.hasMany(Appointments, { foreignKey: "animal_id", onDelete: "CASCADE" });

Rooms.hasMany(Appointments, { foreignKey: "room_id", onDelete: "CASCADE" });
Appointments.belongsTo(Rooms, { foreignKey: "room_id", onDelete: "CASCADE" });
