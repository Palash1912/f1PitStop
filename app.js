// requiring npm
const express = require("express");
require("isomorphic-fetch");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// setting up app
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// home route
app.get("/", function (req, res) {
  res.render("home");
});

// express routing upcoming races
app.get("/calendar/:race", function (req, res) {
  const raceName = req.params.race;
  const roundNo =
    raceName.charAt(raceName.length - 2) + raceName.charAt(raceName.length - 1);
  console.log(raceName);
  console.log(roundNo);

  // timezone
  // const tz=Intl.DateTimeFormat().resolvedOptions().timeZone;
  // console.log(tz);

  // api
  fetch("https://ergast.com/api/f1/current/" + roundNo + ".json")
    .then((response) => response.json())
    .then((data) => {
      // Extract the necessary data
      const raceDATA = data.MRData.RaceTable.Races[0];

      // Render the driverStandingTable view and pass the standings data
      res.render("race", { race: raceDATA });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
});

// express routing finished races
app.get("/results/:race", function (req, res) {
  const raceName = req.params.race;
  const roundNo =
    raceName.charAt(raceName.length - 2) + raceName.charAt(raceName.length - 1);
  console.log(raceName);
  console.log(roundNo);

  if (roundNo === "ff") {
    res.render("calledOff");
  } else {
    // api
    fetch("https://ergast.com/api/f1/current/" + roundNo + ".json")
      .then((response) => response.json())
      .then((data) => {
        // Extract the necessary data
        const raceDATA = data.MRData.RaceTable.Races[0];

        // Render the driverStandingTable view and pass the standings data
        res.render("finishedRace", { race: raceDATA });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
      });
  }
});

// finished race standing
app.get("/finished/:round", function (req, res) {
  // console.log(req.params.round);
  const roundNo = req.params.round;

  // api
  fetch("https://ergast.com/api/f1/current/" + roundNo + "/results.json")
    .then((response) => response.json())
    .then((data) => {
      // Extract the necessary data
      const raceDATA = data.MRData.RaceTable.Races[0];

      // Render the driverStandingTable view and pass the standings data
      res.render("finishedRaceStanding", { standings: raceDATA });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
});

// standing route
app.get("/standing", function (req, res) {
  res.render("standing");
});

// driver standing
app.post("/driverStanding", function (req, res) {
  // res.render("driverStandingTable")

  fetch("http://ergast.com/api/f1/current/driverStandings.json")
    .then((response) => response.json())
    .then((data) => {
      // Extract the necessary data
      const standingsDATA =
        data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

      // Render the driverStandingTable view and pass the standings data
      res.render("driverStandingTable", { standings: standingsDATA });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
});

// constructor standing
app.post("/constructorStanding", function (req, res) {
  // res.render("constructorStandingTable")

  fetch("http://ergast.com/api/f1/current/constructorStandings.json")
    .then((response) => response.json())
    .then((data) => {
      // Extract the necessary data
      const standingsDATA =
        data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

      // Render the driverStandingTable view and pass the standings data
      res.render("constructorStandingTable", { standings: standingsDATA });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
});

// drivers route
app.get("/driver", function (req, res) {
  res.render("drivers");
});

// news route
app.get("/results", function (req, res) {
  res.render("results");
});

// about route
app.get("/about", function (req, res) {
  res.render("about");
});

// calendar route
app.get("/calendar", function (req, res) {
  res.render("calendar");
});

// port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log("server up and running");
});
