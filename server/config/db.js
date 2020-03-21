const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log ('MongoDB connected')
    } catch (err) {
        console.error(err.message);
        //Exit process with faluire
        process.exit(1);
    }
}

module.exports = connectDB;