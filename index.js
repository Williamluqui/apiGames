const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let DB = {
  games: [
    {
      id: 23,
      title: "Call of dutty MW",
      year: 2019,
      price: 60,
    },
    {
      id: 65,
      title: "Battlefield 4",
      year: 2018,
      price: 40,
    },
    {
      id: 2,
      title: "league of legends",
      year: 2020,
      price: 20,
    },
  ],
};

app.get("/games", (req, res) => {
  res.statusCode = 200;
  res.json(DB.games);
});

app.get("/game/:id", (req, res) => {
  let {id} = req.params;

  if (!isNaN(id)) {
    let game = DB.games.find((g) => g.id == id);

    if (game != undefined) {
      res.statusCode = 200;
      res.json(game);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

app.post("/game", (req, res) => {
  let year = Number.parseInt(req.body.year, 10);
  let price = Number(req.body.price);
  let title = String(req.body.title);

  if (!isNaN(year) && !isNaN(price) && title != "") {
    DB.games.push({
      id: 500,
      title,
      price,
      year,
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.put("/game/:id",(req, res)=>{

  if (isNaN(req.params.id)) {
      res.sendStatus(400); 
  } else {
      let id = parseInt(req.params.id);
      let game = DB.games.find(g =>g.id == id);
      
      if (game != undefined) {
        let {title, price, year} = req.body;
       
          if (title != undefined) {
              game.title = title;
          }
          if (price != undefined) {
              game.price = price; 
          }
          if (year != undefined ) {
              game.year = year;
          }
          res.sendStatus(200);
      }else{
        res.sendStatus(400);
      }
    
  }
 
});

app.delete("/game/:id", (req, res) => {
  let {id} = req.params;

  if (!isNaN(id)) {
    //true
    let index = DB.games.findIndex((g) => g.id == id);
    if(index == -1) {
        res.sendStatus(404);
    }else{
        DB.games.splice(index, 1);
        res.sendStatus(200);
    }
  } else {
    //False
    res.sendStatus(400);
  }

});


app.listen(8080, () => {
  console.log("API Rodando");
});
