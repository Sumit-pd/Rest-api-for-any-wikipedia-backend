const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded(
    { extended: true }
));


app.use(express.static("public"));


// mongoose.connect("mongodb://localhost:270171/wikiDB", { useNewUrlParser: true });
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB',);
const Schema = new mongoose.Schema({
    title: String,
    content: String
});
mongoose.set('strictQuery', true);
const wikiDB = mongoose.model("article", Schema);

app.route("/articles")
    .get((req, res) => {
        wikiDB.find((err, foundArticals) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(foundArticals)
            }
        });
    })

    .post((req, res) => {

        const title = req.body.title;
        const content = req.body.content;
        const val1 = new wikiDB({
            title: title,
            content: content
        });
        val1.save();
        res.send(val1);

    })
    .delete((req, res) => {
        wikiDB.deleteMany((err) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send("this shit is done");
            }
        })
    });

app.route("/articles/:title")
    .get((req, res) => {
        wikiDB.findOne({ title: req.params.title }, (err, results) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(results);
            }
        })
    })
    .delete(function (req, res) {
        wikiDB.deleteOne({ title: req.params.title }, function (err) {
            res.send(err);
        })
    }).put(function (req, res) {
        wikiDB.replaceOne(
            { title: req.params.title },
            { title: req.body.title, content: req.body.content } , null , function(err,results){
                if(err){
                    res.send(err);
                }
                else{
                    res.send("this was updated")
                }
            }
        );
    }).patch(function(req , res ){
        wikiDB.updateOne({title:req.params.title} , 
            { content : req.body.content} , function(err,docs){
                if(err){
                    res.send(err);
                }
                else{
                    res.send("the patch was done sucessfully") ;
                }
            })
    })
app.listen(3000, () => {
    console.log("the server is started on port 3000");
});