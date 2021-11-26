const express = require("express");
const { open } = require("sqlite");
const app = express();
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;
app.use(express.json());

const initializingDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server And Db Initialized Successfully");
    });
  } catch (e) {
    console.log(`DbError: ${e.message}`);
    process.exit(1);
  }
};

initializingDbAndServer();

app.connect("/table/", async (request, response) => {
  const QueryForCreatingTable = `CREATE TABLE todo(
        id INTEGER,
        todo TEXT,
        priority TEXT,
        status TEXT
    )`;
  await db.query(QueryForCreatingTable);
  console.log("Table Created Successfully");
});
