//Dependencies
var express =  require("express");
var mongojs =  require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = requires("cheerio");

// Initialize express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scraperData"];

// Hook Mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections); 
db.on("error", function (error) {
    conaole.log ("Yall fucking suck")
})