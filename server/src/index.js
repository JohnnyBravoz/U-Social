const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//inicializations
const app = express();

//settings
app.set('port', process.env.PORT || 4000);


//Middleware

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


//Routes
app.use('/user', require('./routes/userRoutes'));

// Starting the server
app.listen(app.get('port'), () =>{
    console.log('-> Server on port ', app.get('port'));
})

module.exports = app;