require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth = require("./middleware/auth");

const jwtSecret = process.env.SECRET;
const PORT = process.env.PORT;

app.use(cors());


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
  users:[{
    id: 1,
    name:"william",
    email: "teste@gmail.com",
    password: "123456"
  },
  {
    id: 2,
    name:"celso",
    email: "ce@gmail.com",
    password: "123456"
  }
 
  ]
};

app.get("/games", auth,(req, res) => {
  res.status(200);
  res.json({user: req.loggedUser ,games:DB.games});
});

app.get("/game/:id", auth,(req, res) => {
  let {id} = req.params;

  if (!isNaN(id)) {
    let game = DB.games.find((g) => g.id == id);

    if (game != undefined) {
      res.status(200);
      res.json(game);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

app.post("/game", auth,(req, res) => {
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
    res.status(200);
    res.json({auth:true,message:'Modificação feita com sucesso !'})
  } else {
    res.status(400);
  }
});

app.put("/game/:id",auth,(req, res)=>{

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

app.delete("/game/:id",auth, (req, res) => {
  let {id} = req.params;

  if (!isNaN(id)) {
    //true
    let index = DB.games.findIndex((g) => g.id == id);
    if(index == -1) {
        res.sendStatus(404);
    }else{
        DB.games.splice(index, 1);
        res.status(200).json({message: 'Conteúdo removido '});
    }
  } else {
    //False
    res.sendStatus(400);
  }

});

app.post("/auth", (req,res) =>{

  let {email, password} = req.body;
 
  if (!email) {
    return res.status(422).json({mensagem:'Email é obrigatório'})
  }
  if (!password) {
    return res.status(422).json({mensagem:'A senha é obrigatória'})
  }

  if (email != undefined) {
   let users = DB.users.find(u => u.email == email);
    if (users != undefined) {
      if (users.password == password) {
        jwt.sign({id:users.id, email:users.email},jwtSecret,{expiresIn: "15m"},(err,token)=>{
          if (err) {
            res.status(500);
            res.json({error:"Falha interna"})
          }else{
           
          res.status(200);
          res.json({auth: true,token});
           
          }
        });

      }else{
        res.status(401);
        res.json({error: 'Ops ... Email ou senha invalidos!'});
      }
    } else {
      res.status(404);
      res.json({error:"Email enviado não existe na base de dados!"})
    }
  }else{
    res.status(400);
    res.json({error:"Email invalido!"})
  }

});

app.listen(PORT, () => {
  console.log("API Rodando");
});
