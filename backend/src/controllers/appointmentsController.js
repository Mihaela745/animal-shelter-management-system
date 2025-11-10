import { Appointments } from "../models/Appointments.js";

export const controller={
    createAppointment:async(req,res)=>{
        try{
            const {user_id,staff_id,animal_id,room_id,date,hour}=req.body;
            if(!user_id||!staff_id||!animal_id||!room_id||!date||!hour)
                return res.status(400).send(`Must complete all fields!`);
            const appointment=await Appointments.create({
                user_id,
                staff_id,
                animal_id,room_id,date,hour
            })
            return res.status(201).send(appointment);
        }
        catch(err)
        {
            return res.status(500).send(`Error while creating meeting: ${err}`)
        }
    },
    getAllAppointments:async(req,res)=>{
         try {
                      const appointmentId = req.params.id;
                      const appointment = await Appointments.findByPk(appointmentId);
                      if (!appointment) return res.status(404).send(`Couldn't find the appointment`);
                      return res.status(200).send(appointment);
                    } catch (err) {
                      return res.status(500).send(`Couldn't fetch adoption: ${err}`);
                    }
    },
    getAppointmentByStaffId:async(req,res)=>{
                try{const appointments=await Appointments.findAll({where:{staff_id:req.params.id}});
                if(appointments.length===0)
                {
                    return res.status(404).send(`No appointments where found!`);
                }
                return res.status(200).send(appointments);}
                catch(err)
                {
                    return res.status(500).send(`Couldn't fetch appointment:${err}`)
                }
    },
    // getAppointmentsByDate:async(req,res)=>{
    //     const date=req.parmas.date
    // }
    updateAppointment:async(req,res)=>{
          try {
              const appointmentId = req.params.id;
              const updateData = req.body;
              const [updatedRows] = await Appointments.update(updateData, {
                where: {
                  id: appointmentId,
                },
              });
              if (updatedRows === 0) return res.status(400).send(`No rows updated!`);
              const updatedAppointment = await Appointments.findByPk({ where: { id: appointmentId } });
              return res.status(200).send(updatedAppointment);
            } catch (err) {
              return res.status(500).send(`Couldn't change no data: ${err}`);
            }
    },
    deleteAppointment:async(req,res)=>{
         try {
              const appointment = req.params.id;
              const deletedAppointment = await Appointments.destroy(appointment);
              if (deletedAppointment === 0)
                return res.status(404).send(`Appointment not found to be deleted!`);
              return res.status(200).send(`Appointment has been deleted!`);
            } catch (err) {
              return res.status(500).send(`Error at deletion: ${err}`);
            }
    }
}