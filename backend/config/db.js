const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI); //, Connect without the deprecated options);
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
   

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);// Exit process with failure
  }
};

module.exports = connectDB; // Export the connectDB function
