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

  app.post("/api/notes", async (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
      try {
        const data = await fsPromises.readFile(
          path.join(__dirname, "db", "db.json"),
          "utf8"
        );
        const notes = JSON.parse(data);
        const newNote = {
          title,
          text,
          id: notes.length + 1,
        };
        notes.push(newNote);
        await fsPromises.writeFile(
          path.join(__dirname, "db", "db.json"),
          JSON.stringify(notes, null, 4)
        );
        console.info("Note successfully saved.");
        res.send("Note successfully saved.");
      } catch (err) {
        console.error(err);
        res.status(500).json("Error occurred while saving the note.");
      }
    } else {
      res.status(400).json("Bad request: Title and text are required.");
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    const deleteID = req.params.id;
    try {
      const data = await fsPromises.readFile(
        path.join(__dirname, "db", "db.json"),
        "utf8"
      );
      const notes = JSON.parse(data);
      const newNotes = notes.filter((note) => note.id != deleteID);
      newNotes.forEach((note, index) => {
        note.id = index + 1;
      });
      await fsPromises.writeFile(
        path.join(__dirname, "db", "db.json"),
        JSON.stringify(newNotes, null, 4)
      );
      console.info("Note successfully deleted.");
      res.send("Note successfully deleted.");
    } catch (err) {
      console.error(err);
      res.status(500).json("Internal server error");
    }
  });

  app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });
  