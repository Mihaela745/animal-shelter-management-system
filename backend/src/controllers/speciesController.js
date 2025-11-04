import {Species} from '../models/Species.js'

export const initializeSpecies=async(req,res)=>{
try{
    const speciesData=[
        {name:'Dog'},
        {name:'Cat'}
    ];
    const results=await Promise.all(speciesData.map(data=>
        Species.findOrCreate({
            where:{name:data.name},
            default:data
        })
    ));
    return res.status(200).json({
        message:'Species initialized succesfully.',
        details:results.map(([species,created])=>
        created?`Created:${species.name}`:`Found:${species.name}`)
    });
}
catch(error)
{
    console.error('Error initializing species:',error);
    return res.status(500).json({error:'Failed to initialize species.',details:error.message});
}
};

export const getSpecies=async(req,res)=>{
    try{
        const species=await Species.findAll();
        return res.status(200).json(species);
    }
      catch(error){
        console.error('Error fetching species: ',error);
        return res.status(500).json({error:'Failed to create species.'});
    }
}
