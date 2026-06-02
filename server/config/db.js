import mongoose from "mongoose";

const connection = ()=>[
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("[Database] Mongodb connected");
    })
]

export default connection