const express = require('express')
const cors = require('cors')

const whiteList = ['http://localhost:3000']
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if(whiteList.indexOf(req.header('Origin')) !== -1) { //here the condition inside if returns 0 or greater than 0
        corsOptions = {origin: true}
    } 
    else {
        corsOptions = {origin: false}
    }
    callback(null, corsOptions)
}

exports.cors = cors();
exports.corsOptions = cors(corsOptionsDelegate)