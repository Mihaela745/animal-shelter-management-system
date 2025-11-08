import { Box, Boxes } from "../models/Boxes.js";
import { Staff } from "../models/Staff.js";
import { Responsible_box } from "../models/Responsible_box.js";

export const controller = {
  createResponsableBox: async (req, res) => {
    try {
      const { box_id, resposible_id } = req.body;
      if (!box_id || !resposible_id) {
        return res.status(400).send("Must complete all parameters!");
      }
      const resp_box = await Responsible_box.create({
        box_id,
        resposible_id,
      });
      return res.status(201).send(`Created box_resp: ${resp_box}`);
    } catch (err) {
      console.log("Error while creating!");
      return res.status(500).send(`Error while creating:${err}`);
    }
  },
  getAllResponsables: async (req, res) => {
    try {
      const response = await Responsible_box.findAll();
      if (response.length === 0)
        return res.status(404).send("No data found, for responsible staff");
      return res.status(200).send(response);
    } catch (err) {
      console.log("Error while fetching!");
      return res.status(500).send(`Error while fetching:${err}`);
    }
  },
  getResponsablesByBoxId: async (req, res) => {
    try {
      const box_id = req.params.id;
      const box = await Boxes.findByPk({
        where: {
          id: box_id,
        },
      });
      if (!box) return res.status(404).send("Box doesn't exist!");
      const response = await Responsible_box.findAll({
        where: {
          box_id: box_id,
        },
      });
      if (response.length === 0)
        return res.status(404).send("No data found, for responsible staff");
      return res.status(200).send(response);
    } catch (err) {
      onsole.log("Error while fetching!");
      return res.status(500).send(`Error while fetching:${err}`);
    }
  },
  getBoxesByStaffId: async (req, res) => {
    try {
      const res_id = req.params.id;
      const responsable = await Staff.findByPk({
        where: {
          id: res_id,
        },
      });
      if (!responsable) return res.status(404).send("Box doesn't exist!");
      const response = await Responsible_box.findAll({
        where: {
          responsable_id: box_id,
        },
      });
      if (response.length === 0)
        return res.status(404).send("No data found, for responsible staff");
      return res.status(200).send(response);
    } catch (err) {
      console.log("Error while fetching!");
      return res.status(500).send(`Error while fetching:${err}`);
    }
  },
  deleteBoxResponsable:async(req,res)=>{
    try{
        const deletedRows=await Rooms.destroy({
            where:{
                id:req.params.id
            }
        })
        if(deletedRows===0)
            return res.status(404).send("Doesn't exist!")
        return res.status(200).send("Box_resp has been deleted!")
    }
    catch(err)
    {
        console.log('Error while deleting');
        return res.status(500).send(`Error while deleting: ${err}`)
    }
},
//nu are rost de update 
};
