require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

async function checkEvents() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventhive');
    const events = await Event.find({}, 'title bannerImage');
    console.log(JSON.stringify(events, null, 2));
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkEvents();
