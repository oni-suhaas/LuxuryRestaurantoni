const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ✅ HOME PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ MONGODB CONNECT
mongoose.connect("mongodb://restaurant:restaurant123@ac-kxfm07l-shard-00-00.otblvnr.mongodb.net:27017,ac-kxfm07l-shard-00-01.otblvnr.mongodb.net:27017,ac-kxfm07l-shard-00-02.otblvnr.mongodb.net:27017/restaurantDB?ssl=true&replicaSet=atlas-7azk05-shard-0&authSource=admin&retryWrites=true&w=majority")
.then(()=>console.log("✅ MongoDB Connected"))
.catch(err=>console.log("❌ Mongo Error:", err));

// ✅ SCHEMA
const Booking = mongoose.model("Booking", new mongoose.Schema({
  username:String,
  name:String,
  mobile:String,
  guests:Number,
  date:String,
  time:String,
  tableNumber:String
}));

// ✅ BOOK API
app.post("/book", async (req,res)=>{
  try{

    const {date,time,tableNumber} = req.body;

    const exists = await Booking.findOne({date,time,tableNumber});

    if(exists){
      return res.json({success:false,message:"Already booked"});
    }

    await Booking.create(req.body);

    res.json({success:true});

  }catch(err){
    console.log(err);
    res.status(500).json({success:false});
  }
});

// ✅ GET BOOKED TABLES
app.get("/booked", async (req,res)=>{
  const {date,time} = req.query;
  const data = await Booking.find({date,time});
  res.json(data.map(x=>x.tableNumber));
});

// ✅ ADMIN ALL BOOKINGS
app.get("/bookings", async (req,res)=>{
  res.json(await Booking.find());
});

// ✅ USER BOOKINGS
app.get("/my-bookings/:username", async (req,res)=>{
  res.json(await Booking.find({username:req.params.username}));
});

// ✅ DELETE
app.delete("/delete/:id", async (req,res)=>{
  await Booking.findByIdAndDelete(req.params.id);
  res.json({success:true});
});

// 🔥 IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log("🚀 Server running on port " + PORT);
});