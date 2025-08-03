if (process.env.NODE_ENV != "production") {
  require("dotenv").config({ path: "../.env" });
}
const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js")
const MONGO_URL = process.env.ATLAS_DB_URL;
async function main() {
  await mongoose.connect(MONGO_URL);
}
main().then(()=>{
 console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

const initDB=async ()=>{
await Listing.deleteMany({});
initData.data=initData.data.map((obj)=>({...obj,owner:"688f3e134dc82013cbdac3bd"}));
await Listing.insertMany(initData.data);
}

initDB();