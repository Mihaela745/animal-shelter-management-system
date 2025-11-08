import axios from 'axios';

const CAT_API_URL=process.env.CAT_BREED_API_URL;
const CAT_API_KEY=process.env.CAT_API_KEY;

const DOG_API_URL = process.env.DOG_BREED_API_URL;
const DOG_API_KEY = process.env.DOG_API_KEY;

export const controller={ getBreedsBySpecies:async(req,res)=>{
    const species=req.query.species;
    if(!species)
    {
        return res.status(400).json({error:'Species parameter is required (e.g., ?species=Dog or ?species=Cat).'});
    }

    let apiURL;
    let apiKey;

    if(species.toLowerCase()==='cat')
    {
        apiURL=CAT_API_URL;
        apiKey=CAT_API_KEY;
    }else if(species.toLowerCase()==='dog')
    {
        apiURL=DOG_API_URL;
        apiKey=DOG_API_KEY;
    }else{
        return res.status(404).json({error:'Breed list is not available for species:${species}'});
    }

    try{
        if(!apiURL ||!apiKey)
        {
            return res.status(500).json({error:'API URL or Key for ${species} is not configured correctly.'});
        }

        const headers={'x-api-key':apiKey};
        const response =await axios.get(apiURL,{headers});
        return res.status(200).json(response.data);
    }catch(error)
    {
        console.error(`Error fetching ${species} breeds:`, error.message, error.response ? error.response.data : '');
        return res.status(500).json({ 
             error: `Failed to retrieve ${species} breed list from external service.`,
             details: error.message 
        });
    }

}
}