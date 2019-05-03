//Dependencies
var express = require("express");
var mongojs = require("mongojs");
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
    console.log("Database error: ", error);
});

app.get("/", function (req, res) {
    res.send("Ready!")
});

app.get("/all", function (req, res) {
    db.scraperData.find({}, function (error, found) {
        if (error) {
            console.log(error);
        } else {
            res.json(found);
            // res.render('pages/main', {respomse: response}); you can only have one response here at a time.
        }
    });
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.washingtonpost.com/opinions/?nid=top_nav_opinions&utm_term=.23f68f2edfd2").then(function (response) {
        var $ = cheerio.load(response.data);

        var promises = [];
        $(".story-list-story").each(function (i, element) {
            var $el = $(element);
            var title = $el.children().eq(0).children().eq(1).children().eq(1).text();
            var image = $el.children().eq(1).children('a').attr('img');
            var summary = $el.children().eq(0).children().eq(2).text();
            var link = $el.children().eq(1).children('a').attr('href');

            console.log("title", title)
            console.log("title", image)
            console.log("title", summary)
            console.log("title", link)

            if (title && summary && link) {
                var promise = myFunction(title, summary, link)
                promises.push(promise)
            }
        })
                Promise.all(promises)
                    .then(function (result) {
                        console.log(result) 
                            res.render('pages/article_grid', { result });
                        })
                    });
});

app.listen(3001, function () {
        console.log("running on 3001");
    });

function myFunction(title, summary, link) {
    return new Promise(function (resolve, reject) {
        db.scraperData.insert({
            title: title,
            image: image,
            summary: summary,
            link: link
        }, function (err, inserted) {
            if (err) {
                console.log(err);
            } else {
                console.log(inserted);
            }
        }

        
                

        res.send("All Scraped!")
        // for rob the page was rendering too fast so he used promise method but still not working.
        // Promise.all(promises)
        // .then( function(result){
        //     res.json(result)
        //     // res.render('pages/news', {response});
        // })
        }

    


})
}
