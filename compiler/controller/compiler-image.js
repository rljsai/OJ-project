export const runcode = async (req, res) => {
    const { code, language='cpp' } = req.body;
    if(!code){
        res.status(400).json({success: false, message: "code is required"});
    }

    try{

    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}