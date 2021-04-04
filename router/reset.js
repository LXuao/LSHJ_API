const express = require('express');

var MongoClient = require('mongodb').MongoClient
let url = "mongodb://localhost:27017/userinfo"
function getDb(callback) {
    MongoClient.connect(url, (err, db) => {
        callback(err, db)
    })
}
let time
// 清除购保true
clearTimeout(time);
time = setTimeout(() => {
    getDb((err, db) => {
        db.collection('user').find({ 'bx_true': true }, { 'bx_true': true }).forEach(item => {
            db.collection('user').update({ 'bx_true': true }, { $set: { 'bx_true': false } })
        });
        db.collection('user').find({ 'sc_true': true }, { 'sc_true': true }).forEach(item => {
            db.collection('user').update({ 'sc_true': true }, { $set: { 'sc_true': false } })
        });
    })
}, 1000);
