import mongoose from "mongoose";

const connection = ()=>[
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("Data base are connected");
        
    })
]

export default connection