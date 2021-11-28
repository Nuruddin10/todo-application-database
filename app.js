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

const GettingEachTodo = (eachTodo) => {
  return {
    id: eachTodo.id,
    todo: eachTodo.todo,
    priority: eachTodo.priority,
    status: eachTodo.status,
  };
};

// app.post("/table/", async (request, response) => {
//   const QueryForCreatingTable = `CREATE TABLE todo(
//         id INTEGER NOT NULL,
//         todo TEXT,
//         priority TEXT,
//         status TEXT,
//         PRIMARY KEY (id)
//     )`;
//   await db.run(QueryForCreatingTable);
//   response.send("table created successfully");
// });

// app.post("/table/update10/", async (request, response) => {
//   let todoDetailsBody = request.body;
//   let { todo, priority, status } = todoDetailsBody;
//   const QueryForAddingColumns = `INSERT INTO todo(todo,priority,status)
//     values('${todo}','${priority}','${status}')`;
//   await db.run(QueryForAddingColumns);
//   response.send("columns added successfully");
// });

app.get("/todoTable/", async (request, response) => {
  const QueryForGettingItems = `SELECT * FROM todo ;`;
  const dbResponse = await db.all(QueryForGettingItems);
  response.send(dbResponse);
});

app.get("/todos/", async (request, response) => {
  const { status = "", search_q = "", priority = "" } = request.query;
  const QueryForGettingTodoContainingGivenWord = `SELECT * 
    FROM todo WHERE status LIKE '%${status}%' AND 
    todo LIKE '%${search_q}%'AND 
    priority LIKE '%${priority}%';`;
  const listOfTodos = await db.all(QueryForGettingTodoContainingGivenWord);
  response.send(listOfTodos.map((eachTodo) => GettingEachTodo(eachTodo)));
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const QueryForGettingRequiredQuery = `SELECT * FROM todo WHERE id = ${todoId} ;`;
  const TodoItem = await db.get(QueryForGettingRequiredQuery);
  response.send(GettingEachTodo(TodoItem));
});

app.post("/todos/", async (request, response) => {
  let requestBody = request.body;
  let { id, todo, priority, status } = requestBody;
  const QueryForUpdatingTodo = `INSERT INTO todo(id,todo,priority,status)
    VALUES(${id},'${todo}','${priority}','${status}');`;
  await db.run(QueryForUpdatingTodo);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let todoBody = request.body;
  let commandName = Object.keys(todoBody);
  let command = commandName[0];
  let { commandIs } = todoBody;
  const QueryForUpdatingATodo = `UPDATE todo SET ${command} = '${commandIs}'
    WHERE id = ${todoId} ;`;
  await db.run(QueryForUpdatingATodo);
  response.send(`${command} Updated`);
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const QueryForDeletingTodo = `DELETE FROM todo WHERE 
    id = ${todoId};`;
  await db.run(QueryForDeletingTodo);
  response.send("Todo Deleted");
});

module.exports = app;
