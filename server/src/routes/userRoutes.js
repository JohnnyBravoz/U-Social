const { Router } = require('express');
const express = require('express')
const app = Router();

//Ruta para los usuarios 
const User = require('../controllers/userController')

app.post('/create', User.addUsuario);
//app.put('/update', User.updateUsuario);
app.post('/login', User.login);
app.post('/prueba',User.prueba);

module.exports = app;