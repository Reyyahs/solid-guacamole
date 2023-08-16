const express = require("express");
const path = require("path");
const fsPromises = require("fs").promises;

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
  });

  app.get("/api/notes", async (req, res) => {
    try {
      const data = await fsPromises.readFile(
        path.join(__dirname, "db", "db.json"),
        "utf8"
      );
      res.json(JSON.parse(data));
    } catch (err) {
      console.error(err);
      res.status(500).json("Internal server error");
    }
  });
  