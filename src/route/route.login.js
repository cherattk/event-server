/**
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

const express = require('express'),
       Router = express.Router();

const Auth = require('../core/auth.js');

Router.post('/' , function (Request, Response) {
    
    var token = Auth.checkCredential(Request.body);
    if(token){
        Response.cookie("auth_token" , token);
        Response.redirect("http://localhost:1234/manager/entity?type=service");
    }
    else{
        // success
        Response.status(401).send("bad credential value");
    }

});


module.exports = Router;

