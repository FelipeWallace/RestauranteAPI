const express = require("express");
const { Client } = require('pg');
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
/****************/

var conString = config.urlConnection;
var client = new Client(conString);

client.connect(function (err) {
  if (err) {
    return console.error('Não foi possível conectar ao banco.', err);
  }
  client.query('SELECT NOW()', function (err, result) {
    if (err) {
      return console.error('Erro ao executar a query.', err);
    }
    console.log(result.rows[0]);
  });
});


// ROTAS
app.get("/", (req, res) => {
  console.log("Response ok.");
  res.send("Ok – Servidor disponível.");
});

app.listen(config.port, () =>
  console.log("Servidor funcionando na porta " + config.port)
);


// GET USERS
app.get("/usuarios", (req, res) => {
  try {
    client.query("SELECT * FROM Usuarios", function
      (err, result) {
      if (err) {
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      res.send(result.rows);
      console.log("Rota: get usuarios");
    });
  } catch (error) {
    console.log(error);
  }
});

// GET USERS BY ID
app.get("/usuarios/:id", (req, res) => {
  try {
    console.log("Rota: usuarios/" + req.params.id);
    client.query(
      "SELECT * FROM Usuarios WHERE id = $1", [req.params.id],
      (err, result) => {
        if (err) {
          return console.error("Erro ao executar a qry de SELECT id", err);
        }
        res.send(result.rows);
        //console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// DELETE USERS BY ID
app.delete("/usuarios/:id", (req, res) => {
  try {
    console.log("Rota: delete/" + req.params.id);
    client.query(
      "DELETE FROM Usuarios WHERE id = $1", [req.params.id], (err, result) => {
        if (err) {
          return console.error("Erro ao executar a qry de DELETE", err);
        } else {
          if (result.rowCount == 0) {
            res.status(404).json({ info: "Registro não encontrado." });
          } else {
            res.status(200).json({ info: `Registro excluído. Código: ${id}` });
          }
        }
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// POST USERS
app.post("/usuarios", (req, res) => {
  try {
    console.log("Alguém enviou um post com os dados:", req.body);
    const { nome, email, senha, perfil } = req.body;
    client.query(
      "INSERT INTO Usuarios (nome, email, senha, perfil) VALUES ($1, $2,$3, $4) RETURNING * ", [nome, email, senha, perfil],
      (err, result) => {
        if (err) {
          return console.error("Erro ao executar a qry de INSERT", err);
        }
        const { id } = result.rows[0];
        res.setHeader("id", `${id}`);
        res.status(201).json(result.rows[0]);
        console.log(result);
      }
    );
  } catch (erro) {
    console.error(erro);
  }
});

// UPDATE USERS
app.put("/usuarios/:id", (req, res) => {
  try {
    console.log("Alguém enviou um update com os dados:", req.body);
    const id = req.params.id;
    const { nome, email, senha, perfil } = req.body;
    client.query(
      "UPDATE Usuarios SET nome=$1, email=$2, senha=$3, perfil=$4 WHERE id =$5 ",
      [nome, email, senha, perfil, id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de UPDATE", err);
        } else {
          res.setHeader("id", id);
          res.status(202).json({ "identificador": id });
          console.log(result);
        }
      }
    );
  } catch (erro) {
    console.error(erro);
  }
});
/***************************************************/

// GET PAGAMENTOS
app.get("/pagamentos", (req, res) => {
  try {
    client.query("SELECT * FROM pagamentos", function
      (err, result) {
      if (err) {
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      res.send(result.rows);
      console.log("Rota: get pagamentos");
    });
  } catch (error) {
    console.log(error);
  }
});

// POST PAGAMENTOS
app.post("/pagamentos", (req, res) => {
  try {
    console.log("Alguém enviou um post com os dados:", req.body);
    const { data, quantidade } = req.body;
    client.query(
      "INSERT INTO pagamentos (data, quantidade) VALUES ($1, $2) RETURNING * ", [data, quantidade],
      (err, result) => {
        if (err) {
          return console.error("Erro ao executar a qry de INSERT", err);
        }
        const { id } = result.rows[0];
        res.setHeader("id", `${id}`);
        res.status(201).json(result.rows[0]);
        console.log(result);
      }
    );
  } catch (erro) {
    console.error(erro);
  }
});

// UPDATE PAGAMENTOS
app.put("/pagamentos/:id", (req, res) => {
  try {
    console.log("Alguém enviou um update com os dados:", req.body);
    const id = req.params.id;
    const { data, quantidade } = req.body;
    client.query(
      "UPDATE pagamentos SET data=$1, quantidade=$2 WHERE id =$3 ",
      [data, quantidade, id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de UPDATE", err);
        } else {
          res.setHeader("id", id);
          res.status(202).json({ "identificador": id });
          console.log(result);
        }
      }
    );
  } catch (erro) {
    console.error(erro);
  }
});

module.exports = app;
