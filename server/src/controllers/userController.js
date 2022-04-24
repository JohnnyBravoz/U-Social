const mysql =  require('../config/connection');
var AWS = require('aws-sdk');
const aws_keys = require('../config/aws_template');
const s3 = new AWS.S3(aws_keys.s3);

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const cognito = new AmazonCognitoIdentity.CognitoUserPool(aws_keys.cognito);

exports.addUsuario = async (req, res) => {
    var attributelist = [];

    var dataname = {
        Name: 'name',
        Value: req.body.nombres,
    };
    var attributename = new AmazonCognitoIdentity.CognitoUserAttribute(dataname);
    attributelist.push(attributename);

    var datalastname = {
        Name: 'custom:lastname',
        Value: req.body.apellidos,
    };
    var attributelastname = new AmazonCognitoIdentity.CognitoUserAttribute(datalastname);
    attributelist.push(attributelastname);

    var datausuario = {
        Name: 'custom:usuario',
        Value: req.body.usuario,
    };
    var attributeusuario = new AmazonCognitoIdentity.CognitoUserAttribute(datausuario);
    attributelist.push(attributeusuario);

    var dataemail = {
        Name: 'email',
        Value: req.body.email,
    };
    var attributeemail = new AmazonCognitoIdentity.CognitoUserAttribute(dataemail);
    attributelist.push(attributeemail);

    var databot = {
        Name: 'custom:bot',
        Value: req.body.bot,
    };
    var attributebot = new AmazonCognitoIdentity.CognitoUserAttribute(databot);
    attributelist.push(attributebot);

    // var dataimagen = {
    //     Name: 'custom:imagen',
    //     Value: req.body.url,
    // };
    // var attributeimagen = new AmazonCognitoIdentity.CognitoUserAttribute(dataimagen);
    // attributelist.push(attributeimagen);
    // console.log(attributelist);

    cognito.signUp(req.body.usuario, req.body.contrasenia, attributelist, null, async (err, data)=>{
        if (err) {
            console.log(err);
  
            res.json(err.message || err);
            return;
        }

        try {

            
            var usuario = req.body.usuario;
            var foto = req.body.url;

            var nombrei =  usuario +"/images/profile.jpg";

            //se convierte la base64 a bytes
            let buff = new Buffer.from(foto, 'base64');

            const params = {
                Bucket: "archivos-23-p1",
                Key: nombrei,
                Body: buff,
                ContentType: "image",
                ACL: 'public-read'
            };

            const putResult = s3.putObject(params).promise();
            console.log("s3----",putResult);
            
            var urlimage = "https://archivos-23-p1.s3.us-east-2.amazonaws.com/"+usuario+"/images/profile.jpg"
            
            const accion = await generarConsulta(`
            insert into Usuario(Usuario, Contrasenia, URL)
            values( 
                "${req.body.usuario}",
                "${req.body.contrasenia}",
                "${urlimage}"
                )
            `);

            // const accion2 = await generarConsulta(`
            // insert into Carpeta(Nombre, idUser)
            // values(
            //     "root",
            //     ${accion.insertId}
            //     )
            // `);
            console.log(data);
            res.status(200).json({status: 200, msj: "El usuario se creo con exito.", data: accion});
    
        } catch (error) {
            res.status(500).json({status:500, msj:'Error al crear usuario', data:error});
        }

        
        
        //res.json(req.body.usuario +' registrado ---- ' + json);
    });    
}


exports.login = async (req, res) => {

    var authenticationData = {
        Username: req.body.usuario,
        Password: req.body.contrasenia
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );
    var userData = {
        Username: req.body.usuario,
        Pool: cognito,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            // User authentication was successful
            console.log("success");
            res.json(result); //
        },
        onFailure: function (err) {
            // User authentication was not successful
            console.log("Failure");
            if(err.code == "UserNotConfirmedException"){
                res.json({mensaje: "Debe confirmar el correo"})
            }else{
                res.json(err);
            }
            
        },
        mfaRequired: function (codeDeliveryDetails) {
            // MFA is required to complete user authentication.
            // Get the code from user and call
            cognitoUser.sendMFACode(verificationCode, this);
        },
    });
}

exports.prueba = async (req, res) => {
    console.log(req.body);
    res.json.status(500).json(req.body);
}

const generarConsulta = (query) => {
    return new Promise((resolve, reject) => {
        mysql.query(query, (error, result, fields)=> {
            if(error) return reject(error);
            return resolve(result);
        })
    })
}