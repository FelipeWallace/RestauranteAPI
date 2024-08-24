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
  res.send("Ok – Servidor disponível.");
});

app.listen(config.port, () =>
  console.log("Servidor funcionando na porta " + config.port)
);


// READ (GET) USERS
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

// READ (GET) USERS BY ID
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
    client.query(
      "DELETE FROM Usuarios WHERE id = $1", [req.params.id], (err, result) => {
        if (err) {
          res.status(400).send("Erro: " + err);
        } else {
          if (result.rowCount == 0) {
            res.status(404).json({ info: "Registro não encontrado." });
          } else {
            res.status(200).json({ info: "Registro excluído." });
          }
        }
      }
    );
  } catch (error) {
    res.status(404).send("Erro: " + error);
  }
});

// CREATE (POST) USERS
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

// UPDATE (PUT) USERS
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

// READ (GET) PAGAMENTOS
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

// READ (GET) PAGAMENTOS BY ID
app.get("/pagamentos/:id", (req, res) => {
  try {
    console.log("Rota: pagamentos/" + req.params.id);
    client.query(
      "SELECT * FROM pagamentos WHERE id = $1", [req.params.id],
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

// DELETE PAGAMENTOS BY ID
app.delete("/pagamentos/:id", (req, res) => {
  try {
    console.log("Rota: delete/" + req.params.id);
    client.query(
      "DELETE FROM pagamentos WHERE id = $1", [req.params.id], (err, result) => {
        if (err) {
          return console.error("Erro ao executar a qry de DELETE", err);
        } else {
          if (result.rowCount == 0) {
            res.status(404).json({ info: "Registro não encontrado." });
          } else {
            res.status(200).json({ info: `Registro excluído.` });
          }
        }
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// CREATE (POST) PAGAMENTOS
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

// UPDATE (PUT) PAGAMENTOS
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
/*******************************************/

// READ (GET) CARDAPIO
app.get("/cardapio", (req, res) => {
  try {
    client.query("SELECT * FROM cardapio", function
      (err, result) {
      if (err) {
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      res.send(result.rows);
      console.log("Rota: get cardapio");
    });
  } catch (error) {
    console.log(error);
  }
});

// READ (GET) CARDAPIO BY ID
app.get("/cardapio/:id", (req, res) => {
  try {
    console.log("Rota: cardapio/" + req.params.id);
    client.query(
      "SELECT * FROM cardapio WHERE id = $1", [req.params.id],
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

// DELETE CARDAPIO BY ID
app.delete("/cardapio/:id", (req, res) => {
  try {
    console.log("Rota: delete/" + req.params.id);
    client.query(
      "DELETE FROM cardapio WHERE id = $1", [req.params.id], (err, result) => {
        if (err) {
          return console.error("Erro ao executar a qry de DELETE", err);
        } else {
          if (result.rowCount == 0) {
            res.status(404).json({ info: "Registro não encontrado." });
          } else {
            res.status(200).json({ info: `Registro excluído.` });
          }
        }
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// CREATE (POST) CARDAPIO
app.post("/cardapio", (req, res) => {
  try {
    console.log("Alguém enviou um post com os dados:", req.body);
    const { data, refeicao, titulo } = req.body;
    client.query(
      "INSERT INTO cardapio (data, refeicao, titulo) VALUES ($1, $2, $3) RETURNING * ", [data, refeicao, titulo],
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

// UPDATE (PUT) CARDAPIO
app.put("/cardapio/:id", (req, res) => {
  try {
    console.log("Alguém enviou um update com os dados:", req.body);
    const id = req.params.id;
    const { data, refeicao, titulo } = req.body;
    client.query(
      "UPDATE cardapio SET data=$1, refeicao=$2, titulo=$3 WHERE id =$4 ",
      [data, refeicao, titulo, id],
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
/*******************************************/

// READ (GET) AVISOS
app.get("/avisos", (req, res) => {
  try {
    client.query("SELECT * FROM avisos", function
      (err, result) {
      if (err) {
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      res.send(result.rows);
      console.log("Rota: get avisos");
    });
  } catch (error) {
    console.log(error);
  }
});

// READ (GET) AVISOS BY ID
app.get("/avisos/:id", (req, res) => {
  try {
    console.log("Rota: avisos/" + req.params.id);
    client.query(
      "SELECT * FROM avisos WHERE id = $1", [req.params.id],
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

// DELETE AVISOS BY ID
app.delete("/avisos/:id", (req, res) => {
  try {
    console.log("Rota: delete/" + req.params.id);
    client.query(
      "DELETE FROM avisos WHERE id = $1", [req.params.id], (err, result) => {
        if (err) {
          return console.error("Erro ao executar a qry de DELETE", err);
        } else {
          if (result.rowCount == 0) {
            res.status(404).json({ info: "Registro não encontrado." });
          } else {
            res.status(200).json({ info: `Registro excluído.` });
          }
        }
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// CREATE (POST) AVISOS
app.post("/avisos", (req, res) => {
  try {
    console.log("Alguém enviou um post com os dados:", req.body);
    const { data, hora, aviso, tipo, usuarios_id } = req.body;
    client.query(
      "INSERT INTO avisos (data, hora, aviso, tipo, usuarios_id) VALUES ($1, $2, $3, $4, $5) RETURNING * ", [data, hora, aviso, tipo, usuarios_id],
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

// UPDATE (PUT) AVISOS
app.put("/avisos/:id", (req, res) => {
  try {
    console.log("Alguém enviou um update com os dados:", req.body);
    const id = req.params.id;
    const { data, hora, aviso, tipo, usuarios_id } = req.body;
    client.query(
      "UPDATE avisos SET data=$1, hora=$2, aviso=$3, tipo=$4, usuarios_id=$5 WHERE id =$6 ",
      [data, hora, aviso, tipo, usuarios_id, id],
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
/*******************************************/

// READ (GET) ITEM
app.get("/item", (req, res) => {
  try {
    client.query("SELECT * FROM item", function
      (err, result) {
      if (err) {
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      res.send(result.rows);
      console.log("Rota: get item");
    });
  } catch (error) {
    console.log(error);
  }
});

// READ (GET) ITEM BY ID
app.get("/item/:id", (req, res) => {
  try {
    console.log("Rota: item/" + req.params.id);
    client.query(
      "SELECT * FROM item WHERE id = $1", [req.params.id],
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

// DELETE ITEM BY ID
app.delete("/item/:id", (req, res) => {
  try {
    console.log("Rota: delete/" + req.params.id);
    client.query(
      "DELETE FROM item WHERE id = $1", [req.params.id], (err, result) => {
        if (err) {
          return console.error("Erro ao executar a qry de DELETE", err);
        } else {
          if (result.rowCount == 0) {
            res.status(404).json({ info: "Registro não encontrado." });
          } else {
            res.status(200).json({ info: `Registro excluído.` });
          }
        }
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// CREATE (POST) ITEM
app.post("/item", (req, res) => {
  try {
    console.log("Alguém enviou um post com os dados:", req.body);
    const { nome, descricao, imagem_url, cardapio_id } = req.body;
    client.query(
      "INSERT INTO item (nome, descricao, imagem_url, cardapio_id) VALUES ($1, $2, $3, $4) RETURNING * ", [nome, descricao, imagem_url, cardapio_id],
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

// UPDATE (PUT) ITEM
app.put("/item/:id", (req, res) => {
  try {
    console.log("Alguém enviou um update com os dados:", req.body);
    const id = req.params.id;
    const { nome, descricao, imagem_url, cardapio_id } = req.body;
    client.query(
      "UPDATE item SET nome=$1, descricao=$2, imagem_url=$3, cardapio_id=$4 WHERE id =$5 ",
      [nome, descricao, imagem_url, cardapio_id, id],
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
/*******************************************/

// READ (GET) AVALIACAO
app.get("/avaliacao", (req, res) => {
  try {
    client.query("SELECT * FROM avaliacao", function
      (err, result) {
      if (err) {
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      res.send(result.rows);
      console.log("Rota: get avaliacao");
    });
  } catch (error) {
    console.log(error);
  }
});

// READ (GET) AVALIACAO BY ID
app.get("/avaliacao/:id", (req, res) => {
  try {
    console.log("Rota: avaliacao/" + req.params.id);
    client.query(
      "SELECT * FROM avaliacao WHERE id = $1", [req.params.id],
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

// DELETE AVALIACAO BY ID
app.delete("/avaliacao/:id", (req, res) => {
  try {
    console.log("Rota: delete/" + req.params.id);
    client.query(
      "DELETE FROM avaliacao WHERE id = $1", [req.params.id], (err, result) => {
        if (err) {
          return console.error("Erro ao executar a qry de DELETE", err);
        } else {
          if (result.rowCount == 0) {
            res.status(404).json({ info: "Registro não encontrado." });
          } else {
            res.status(200).json({ info: `Registro excluído.` });
          }
        }
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// CREATE (POST) AVALIACAO
app.post("/avaliacao", (req, res) => {
  try {
    console.log("Alguém enviou um post com os dados:", req.body);
    const { comentario, data, usuarios_id, cardapio_id, pontuacao } = req.body;
    client.query(
      "INSERT INTO avaliacao (comentario, data, usuarios_id, cardapio_id, pontuacao) VALUES ($1, $2, $3, $4, $5) RETURNING * ", [comentario, data, usuarios_id, cardapio_id, pontuacao],
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

// UPDATE (PUT) AVALIACAO
app.put("/avaliacao/:id", (req, res) => {
  try {
    console.log("Alguém enviou um update com os dados:", req.body);
    const id = req.params.id;
    const { comentario, data, usuarios_id, cardapio_id, pontuacao } = req.body;
    client.query(
      "UPDATE avaliacao SET comentario=$1, data=$2, usuarios_id=$3, cardapio_id=$4, pontuacao=$5 WHERE id =$6 ",
      [comentario, data, usuarios_id, cardapio_id, pontuacao, id],
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

/*******************************************/
module.exports = app;
