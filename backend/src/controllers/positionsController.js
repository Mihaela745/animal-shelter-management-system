import { Position } from "../models/Position.js";

export const initializePositions=async(req,res)=>{
    try{
        const positionsData=[
            {title:'Vet',
            description:'Responsible for animal healthcare, treatments, and check-ups.'
            },
            {
            title:'Manager',
            description:'Oversees the entire shelter; manages staff and the adoption process.'
            },
             {
            title:'Caretaker',
            description:'Feeds, cleans, and provides daily care for the animals.'
            },
        ];
        const results=await Promise.all(positionsData.map(data=>{
            Position.findOrCreate({
                where:{
                    title:data.title,
                },
                defaults:{
                    title:data.title,
                    description:data.description
                }
            })
        }));
        return res.status(200).json({
            message:'Positions initialized',
            details:results.map(([position,created])=>{
              created?`Created:${position.title}`:`Found:${position.title}`  
            })
        });
    }
    catch(error)
    {
        console.error('Error initializing species:',error);
        return res.status(500).json({error:'Failed to initialize positions.',detaild:error.message});
    }
};

export const getAllPositions=async(req,res)=>{
  try{  const positions=await Position.findAll();
    res.status(200).json({succes:true,count:positions.length,data:positions})}
    catch(error){
        return res.status(500).json({
            succes:false,
            error:'Failed to fetch positions.',
            detais:error.message
        });
    }
};