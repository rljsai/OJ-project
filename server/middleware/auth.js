import jwt from 'jsonwebtoken'

export const verifytoken = async (req, res, next) => {
    const token = req.headers['auth'];
    if (!token) {
        return res.status(401).send("Token not found");
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();

    } catch (error) {
        console.log("auth failed ", error.message);
        res.status(500).json(
            {
                message: "auth failed",
                error: error.message,
            });
    }
}


