const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
//Connect DB
connectDB();

//Init Middleware
app.use( bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit:50000
}));
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 4000;

//static assets in production
// app.use(express.static(path.join(__dirname, 'client', 'build')));
//     app.get("*", (req, res) => {
//         res.sendFile(path.join(__dirname + "./client/build/index.html"));
//         });


app.listen(PORT, () => console.log(`Server strated on ${PORT}`));
