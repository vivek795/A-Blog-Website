//jshint esversion:6

// Deployed website -->>    https://secure-citadel-39763.herokuapp.com/

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');              // _ refers to the lodash utility library.

// mongoose.connect("mongodb://localhost:27017/blogDB");

mongoose.connect("mongodb+srv://admin-vivek:Test123@cluster0.o5cqqis.mongodb.net/blogDB");   // to access mongoDB cloud Atlas.

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model("Post",postSchema);

// const posts = []; 


app.get("/", function(req,res){
    Post.find(function(err,postsFound){
        if(err){
            console.log(err);
        }
        else{
            res.render("home", {homeContent : homeStartingContent, contents : postsFound});
        }
    });
});

app.get("/about", function(req,res){
    res.render("about", {Content : aboutContent});
});

app.get("/contact", function(req,res){
    res.render("contact", {Content : contactContent});
});

app.get("/compose",function(req,res){
    res.render("compose");
});

app.post("/compose",function(req,res){
    // console.log(req.body.postTitle);

    var post = new Post({
        title : req.body.postTitle,
        content : req.body.postBody
    });

    post.save(function(err){
        if(!err){
            res.redirect("/");
        }
    });
    
});

app.get("/posts/:postName",function(req,res){
    // console.log(req.params.data);

    // var requestedTitle = _.lowerCase(req.params.postName);
    var requestedTitle = req.params.postName;        // can also receive _id of the document by passing _id instead of title in
                                                    // home.ejs, then the finding becomes easier and no need of using RegExp() ;

    Post.findOne({title : new RegExp(requestedTitle, "i")}, function(err, foundPost){
        if(err){
            console.log(err);
        }
        else{
            res.render("post", { post : foundPost });
        }
    });
    
});



app.get("/delete/:postID",function(req,res){

    const postid = req.params.postID;

    Post.findByIdAndRemove({_id : postid}, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Deleted Successfully.");
            res.redirect("/");
        }
    });
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
