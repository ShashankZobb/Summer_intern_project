const mysql = require("mysql");
//const { USER, PASSWORD, DATABASE } = require("./config");

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "summer_project",
});

database.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");

    let createRooms = `create table if not exists rooms(room_id int, roomNumber varchar(8), dept_name varchar(8), primary key (room_id));`;
    let createBooking = `create table if not exists booking(room_id int, roomNumber varchar(8), name varchar(15), email varchar(30),phoneNumber varchar(18), event varchar(15), slot varchar(12), event_date varchar(12), foreign key (room_id) references rooms(room_id));`;
    let createUsers = `create table if not exists users(user_id int not null auto_increment, user_name varchar(15), primary key (user_id));`;
    let createSlot = `create table if not exists slot(slot varchar(12))`;

    database.query(createRooms, (err, rows, fields) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
    });

    database.query(createBooking, (err, rows, fields) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
    });

    database.query(createUsers, (err, rows, fields) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
    });
    database.query(createSlot, (err, rows, fields) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
    });
  }
});

module.exports = database;
