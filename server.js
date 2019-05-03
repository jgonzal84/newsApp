//Dependencies
var express =  require("express");
var mongojs =  require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scraperData"];

// Hook Mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections); 
db.on("error", function (error) {
    console.log ("Database error: ", error);
});

app.get("/", function (req, res) {
    res.send("Ready!")
});

app.get("/all", function (req, res) {
    db.scrapedData.find({}, function (error, found) {
        if (error) {
            console.log(error);
        } else {
            res.json(found);
        }
    });
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.washingtonpost.com/opinions/?nid=top_nav_opinions&utm_term=.23f68f2edfd2").then(function (response) {
        var $ = cheerio.load(response.data);
        $(".story-list-story").each(function (i, element) {
            var $el = $(element);

            console.log("title: ", $el.children().eq(0).children().eq(1).children().eq(1).text()); //html());
            console.log("link", $el.children().eq(1).children('a').attr('href'));
            console.log("summary: ", $el.children().eq(0).children().eq(2).text()); //html());
            console.log('---------')
            console.log('---------')

            var title = $(element).children('a').text();
            var image = $(element).children('img').attr('src');
            var summary = $(element).children('p').text();
            var link = $(element).children('a').attr("href");

            console.log(title, summary, link);

            if (title && summary && link) {
                db.scrapedData.insert({
                    title: Title,
                    summary: Summary,
                    link: Link
                },
                function (err, inserted){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(inserted);
                    }
                });
            }
        })
    })
    res.send("All Scraped!")
});

app.listen(3001, function () {
    console.log("running on 3001");
})



