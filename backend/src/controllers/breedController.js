import axios from 'axios';

const CAT_API_URL=process.env.CAT_BREED_API_URL;
const CAT_API_KEY=process.env.CAT_API_KEY;

const DOG_API_URL = process.env.DOG_BREED_API_URL;
const DOG_API_KEY = process.env.DOG_API_KEY;

export const controller={ getBreedsBySpecies:async(req,res)=>{
    const species=req.params.id;
    if(!species)
    {
        return res.status(400).send('Species parameter is required (e.g., ?species=Dog or ?species=Cat).');
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
        return res.status(404).send('Breed list is not available for species:${species}');
    }

    try{
        if(!apiURL ||!apiKey)
        {
            return res.status(500).send('API URL or Key for ${species} is not configured correctly.');
        }

        const headers={'x-api-key':apiKey};
        const response =await axios.get(apiURL,{headers});
        return res.status(200).send(response.data);
    }catch(error)
    {
        console.error(`Error fetching ${species} breeds:`, error.message, error.response ? error.response.data : '');
        return res.status(500).send(`Error while fetching ap: ${error}`);
    }

}
}