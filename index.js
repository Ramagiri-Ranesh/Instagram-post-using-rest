const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const { error } = require('console');
const app = express();
const port = 8080;

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));


const connection =  mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'sigma_app',
  password:'ranesh3120'
});


// let getRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.username(), // before version 9.1.0, use userName()
//     faker.image.avatar(),
//     Math.floor(Math.random() * 100) + 1,
//     Math.floor(Math.random() * 50) + 1
//   ];
// }


// let data = [];

// for (let index = 1; index <= 30; index++) {
//     data.push(getRandomUser());
// }

// let q = "INSERT INTO posts (id,username,img,likes,comments) VALUES ?";

// try {
//    connection.query(q, [data], (err, result) => {
//         if(err) throw err;
//         console.log(result);
//    });
    
// } catch (err) {
//     console.log(err);
// }


// let posts = [
//     {
//         id : uuidv4(),
//         username : "Ramagiri_Ranesh",
//         img : 'https://media.istockphoto.com/id/1164329797/photo/hindu-sadhu-sitting-on-a-boat-overlooking-varanasi-city-architecture-at-sunset.jpg?s=612x612&w=0&k=20&c=LbpIHRo7kGT7dbUr6b6UuD1d6P0yCaKZ2lbqo3TY988=',
//         caption : "kashi a place to visit",
//         likes : 20,
//         comments : 5 
//     },
//     {
//         id : uuidv4(),
//         username : "Ramagiri_Nagaraju",
//         img : 'https://media.istockphoto.com/id/827065008/photo/holy-town-varanasi-and-the-river-ganges.jpg?s=612x612&w=0&k=20&c=WHGBF2zwPkVMpAma832RbHrov6VwKIMXuDR3N2WmfGg=',
//         caption : "kashi a place of lord shiva",
//         likes : 15,
//         comments : 2 
//     },
//     {
//         id : uuidv4(),
//         username : "Pathlavath_Srikanth",
//         img : 'https://yu-hotel.com/wp-content/uploads/2023/03/best-luxury-hotels-in-north-goa-YU-Hotel.jpg',
//         caption : "Goa is place to vibe",
//         likes : 30,
//         comments : 10 
//     },

// ];

// Home route
app.get("/", (req,res) => {
    res.send("Home route");
});

// All posts
// GET Route - Index route
app.get("/posts", (req,res) => {
    let q = `SELECT * FROM posts`;
    try {
        connection.query(q, (err,result) => {
            if(err) throw err;
            let posts = result;
            res.render("index.ejs", {posts});
            
        });
    } catch (error) {
        console.log(error);
        res.send("some error in DB");
    }
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
    let q = `INSERT INTO POSTS (username,img,id,likes,comments,caption) VALUES ("${username}","${img}","${id}","${likes}","${comments}","${caption}")`;
    try {
        connection.query(q, (err,result) => {
            if(err) throw err;
            res.redirect("/posts");
        });
    } catch (error) {
        console.log(error);
        res.send("some error in DB");
    }
});

// SHOW ROUTE
app.get("/posts/:id", (req,res) => {
    let { id } = req.params;
    let q = `SELECT * FROM posts WHERE id = "${id}"`;
    try {
        connection.query(q, (err, result) => {
            if(err) throw err;
            let post = result[0];
            if(!post){
                res.render("error.ejs");
            }else{
                res.render("show.ejs",{post});
            }
        });
    } catch (error) {
        console.log(error);
        res.send("Some error in DB");
    }
    
});

// PATCH Request
// EDIT Route
app.get("/posts/:id/edit", (req,res) => {
    let { id } = req.params;
    let q = `SELECT * FROM posts WHERE id = "${id}"`;
    try {
        connection.query(q, (err, result) => {
            if(err) throw err;
            let post = result[0];
            res.render("edit.ejs", {post});
        });
    } catch (error) {
        console.log(error);
        res.send("Some error in DB");
    }
    
});

// Patch Route
app.patch("/posts/:id", (req,res) => {
    let { id } = req.params;
    let q = `SELECT * FROM posts WHERE id = "${id}"`;
    try {
        connection.query(q, (err, result) => {
            if(err) throw err;
            let newImg = req.body.img;
            let newCaption = req.body.caption;
            let q2 = `UPDATE posts SET img = "${newImg}",caption = "${newCaption}" WHERE id = "${id}"`;
            connection.query(q2, (err, result) => {
                if(err) throw err;
                res.redirect("/posts"); 
            });

        });
    } catch (error) {
        console.log(error);
        res.send("Some error in DB");
    }
    
});

app.delete("/posts/:id",(req,res) => {
    let { id } = req.params;
    let q = `SELECT * FROM posts WHERE id = "${id}"`;
    try {
        connection.query(q, (err,result) => {
            if(err) throw err;
            let q2 = `DELETE FROM posts WHERE id = '${id}'`;
            connection.query(q2, (err,result) => {
                if(err) throw err;
                res.redirect("/posts");
            });
        });
    } catch (error) {
        console.log(error);
        res.send("Some error in DB");
    }
});


app.listen(port, () => {
    console.log(`app is listening to port ${port}`);
});