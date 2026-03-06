const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const activitySchema = new mongoose.Schema({

 id: String,
 userId: String,
 eventType: String,
 timestamp: Date,
 processedAt: Date,
 payload: Object

});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = async function(activity){

 const newActivity = new Activity({

   id: uuidv4(),
   userId: activity.userId,
   eventType: activity.eventType,
   timestamp: activity.timestamp,
   processedAt: new Date(),
   payload: activity.payload

 });

 await newActivity.save();

};