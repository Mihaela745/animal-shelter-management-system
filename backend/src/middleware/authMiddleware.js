import jwt from "jsonwebtoken"
const JWT_SECRET=process.env.JWT_SECRET
export const verifyToken=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    if(!token)
        return res.status(401).send(`Acces denied!`)
    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        req.user=decoded
        next();
    }
    catch(err)
    {
        return res.status(403).send("Token invalid sau expirat");
    }
}
export const authorizeRoles=(...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user|| !allowedRoles.includes(req.user.role))
        {
            return res.status(403).send("Acces dennied!")
        }
        next();
    }
}