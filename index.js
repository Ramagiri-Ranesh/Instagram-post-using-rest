const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const app = express();
const port = 8080;

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));


let posts = [
    {
        id : uuidv4(),
        username : "Ramagiri_Ranesh",
        img : 'https://media.istockphoto.com/id/1164329797/photo/hindu-sadhu-sitting-on-a-boat-overlooking-varanasi-city-architecture-at-sunset.jpg?s=612x612&w=0&k=20&c=LbpIHRo7kGT7dbUr6b6UuD1d6P0yCaKZ2lbqo3TY988=',
        caption : "kashi a place to visit",
        likes : 20,
        comments : 5 
    },
    {
        id : uuidv4(),
        username : "Ramagiri_Nagaraju",
        img : 'https://media.istockphoto.com/id/827065008/photo/holy-town-varanasi-and-the-river-ganges.jpg?s=612x612&w=0&k=20&c=WHGBF2zwPkVMpAma832RbHrov6VwKIMXuDR3N2WmfGg=',
        caption : "kashi a place of lord shiva",
        likes : 15,
        comments : 2 
    },
    {
        id : uuidv4(),
        username : "Pathlavath_Srikanth",
        img : 'https://yu-hotel.com/wp-content/uploads/2023/03/best-luxury-hotels-in-north-goa-YU-Hotel.jpg',
        caption : "Goa is place to vibe",
        likes : 30,
        comments : 10 
    },

];

// Home route
app.get("/", (req,res) => {
    res.send("Home route");
});

// All posts
// GET Route - Index route
app.get("/posts", (req,res) => {
    res.render("index.ejs", {posts});
});

// Create a new Post
app.get("/posts/new", (req,res) => {
    res.render("new.ejs");
});

app.post("/posts", (req,res) => {
    let {username,img,caption} = req.body;
    let id = uuidv4();
    let likes = Math.floor(Math.random() * 20) + 1;
    let comments = Math.floor(Math.random() * 20) + 1;
    posts.push({username,img,id,likes,comments,caption});
    res.redirect("/posts");
});

// SHOW ROUTE
app.get("/posts/:id", (req,res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    if(!post){
        res.render("error.ejs");
    }else{
        res.render("show.ejs",{post});
    }
});

// PATCH Request
// EDIT Route
app.get("/posts/:id/edit", (req,res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", {post});
});

// Patch Route
app.patch("/posts/:id", (req,res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    let newImg = req.body.img;
    let newCaption = req.body.caption;
    post.img = newImg;
    post.caption = newCaption;
    res.redirect("/posts"); 
});

app.delete("/posts/:id",(req,res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
});


app.listen(port, () => {
    console.log(`app is listening to port ${port}`);
});