/////https://salty-taiga-06312.herokuapp.com



const express = require("express");
const cors = require("cors");
const app = express();
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB("mongodb+srv://dbUser:12345@cluster0.jgipa.mongodb.net/sample_restaurants?retryWrites=true&w=majority");

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());


// Deliver the app's home page to browser clients
app.get("/", (req,res) => {
    res.send("<h3>WEB Service (API) - Restaurants</h3>"
    +"<h4>Items (template)</h4>"
    +"<ul><li>R - Get all Restaurants <a href='/api/restaurants?page=1&perPage=8'>/api/restaurants?page=1&perPage=8</a></li>"
    +"<li>R - Get all Restaurants <a href='/api/restaurants?page=1&perPage=8&borough=Brooklyn'>/api/restaurants?page=1&perPage=8&borough=Brooklyn</a></li></ul>"
    +"<ul><li>R - Get one Restaurant <a href='/api/restaurants/55eb3d668b31de5d588f4292a'>/api/restaurants/5eb3d668b31de5d588f42939</a></li></ul>"
    
   
    );
});

// Deliver the app's home page to browser clients


//////////Add the routes
//POST /api/restaurants
app.post("/api/restaurants", (req,res) => {
    db.addNewRestaurant(req.body)
    .then((msg) => {
            res.status(201).json({message:msg});
        })
        .catch((err) => {
            res.status(500).json({message:`an error occured :${err}`});
        });
});

//GET /api/restaurants

app.get("/api/restaurants", (req,res) => {
    db.getAllRestaurants(req.query.page, req.query.perPage,req.query.borough)
        .then(data=>{
            console.log("Restaurants array in server.js GetAll route: ",data);
            res.json(data);
        }) .catch((err)=>{
            res.status(500).json({message:`an error occured :${err}`});
        });
    });

//GET /api/restaurants

app.get("/api/restaurants/:_id", (req,res) => {
    db.getRestaurantById(req.params.id)
        .then((data) => {
            console.log("one Restaurant in server.js Get one route: ",data);
            res.json(data);
        })
        .catch((err) => {
            res.status(500).json({message:`an error occured :${err}`});
        });
});


//PUT /api/restaurants

app.put("/api/restaurants/:id", (req,res) => {
    db.updateRestaurantById(req.body, req.params.id)
        .then((msg) => {
            res.json({message:msg});
        })
        .catch((err) => {
            res.status(500).json({message:`an error occured :${err}`});
        });
});

//DELETE /api/restaurants

app.delete("/api/restaurants/:id", (req,res) => {
    db.deleteRestaurantById(req.params.id)
        .then((msg) => {
            res.status(204).end();
        })
        .catch((err) => {
            res.status(500).json({message:`an error occured :${err}`});
        });
});

app.use((req, res) => {
    res.status(404).send("Resource not found");
  });
db.initialize().then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
    }).catch((err)=>{
    console.log(err);
    });

  
    //  app.listen(HTTP_PORT, () => {
      //  console.log("Ready to handle requests on port " + HTTP_PORT);
   //});

//////////END Add the routes
