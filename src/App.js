import "./styles.css";
import { useState, useEffect, useRef } from "react";
// import ReactDOM from 'react-dom';
import { Restaurant } from "./restaurant";
import { ConfirmDialog } from "./confirmdialog";
import { ResultsCard } from "./resultscard";
import Autocomplete from "@mui/material/Autocomplete";
import Container from "@mui/material/Container";
// import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import citiesObj from "./cities.json";

import SwipeableViews from "react-swipeable-views";

// const city = "tampere";
const restaurantSearchUrl =
  "//lauri.space/solidabiskoodihaaste22/api/v1/restaurants/";

const voteResultsUrl = "//lauri.space/solidabiskoodihaaste22/api/v1/results/";

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [proposedRestaurant, setProposedRestaurant] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [voteResults, setVoteResults] = useState([]);
  const [alreadyVotedId, setAlreadyVotedId] = useState(null);
  const [date, setDate] = useState("");
  const [tab, setTab] = useState("0");
  const [showResultsNotice, setShowResultsNotice] = useState(false);
  // console.log("rendering App");
  const voteResultUpdateIntervalRef = useRef();
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    if (selectedCity)
      fetch(`${restaurantSearchUrl + selectedCity}`)
        .then((r) => r.json())
        .then((json) => {
          if (json && json.alreadyVoted) {
            setAlreadyVotedId(json.alreadyVoted);
            console.log("already voted for", json.alreadyVoted);
          }
          if (json.date) setDate(json.date);
          setRestaurants((json && json.restaurants) || []);
        });

    fetch(`${voteResultsUrl}`)
      .then((r) => r.json())
      .then((json) => {
        if (((json && json.results) || []).length) setShowResultsNotice(true);
        setVoteResults((json && json.results) || []);
      });
  }, [selectedCity]);

  clearInterval(voteResultUpdateIntervalRef.current);
  voteResultUpdateIntervalRef.current = setInterval(() => {
    fetch(`${voteResultsUrl}`)
      .then((r) => r.json())
      .then((json) => {
        //if on vote-tab, calculate if results got changed,
        //this uses just basic stringify comparison
        if (tab !== "1") {
          if (
            JSON.stringify((json && json.results) || []) !==
            JSON.stringify(voteResults)
          ) {
            console.log("updated results!");
            console.log(
              "compared",
              JSON.stringify((json && json.results) || []),
              "with"
            );
            console.log(JSON.stringify(voteResults));
            setShowResultsNotice(true);
          }
        }
        setVoteResults((json && json.results) || []);
      });
  }, 6000);

  //reset the notice icon
  const resetNoticeIconIfNeeded = () => {
    if (tab === "1" && showResultsNotice === true) setShowResultsNotice(false);
  };

  const voteRestaurant = (restaurant) => {
    setProposedRestaurant(restaurant);
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
  const handleTabSwipe = (newValue) => {
    setTab("" + newValue);
  };

  const handleVoteSuccess = (restaurant) => {
    fetch("//lauri.space/solidabiskoodihaaste22/api/v1/vote/" + restaurant.id, {
      method: "POST"
    }).then((res) => {
      if (alreadyVotedId !== restaurant.id) {
        setAlreadyVotedId(restaurant.id);
      } else setAlreadyVotedId("");

      console.log("POST Status", res.status);
    });
  };

  resetNoticeIconIfNeeded();

  return (
    <Container maxWidth="sm">
      <h1>Lounaspaikkaäänestys</h1>
      <Stack direction="column" spacing={2}>
        <Autocomplete
          disablePortal
          blurOnSelect
          id="combo-box-demo"
          options={citiesObj.cities}
          sx={{ width: 250 }}
          onChange={(_, newVal) => setSelectedCity(newVal)}
          renderInput={(params) => <TextField {...params} label="Kaupunki" />}
        />
      </Stack>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            centered
            onChange={handleTabChange}
            aria-label="lab API tabs example"
          >
            <Tab label="Äänestys" value="0" />
            <Tab
              label="Tulokset"
              icon={
                showResultsNotice ? (
                  <NewReleasesIcon fontSize="small" color="primary" />
                ) : (
                  <></>
                )
              }
              iconPosition="end"
              value="1"
            >
              derp
            </Tab>
          </TabList>
        </Box>
        <SwipeableViews
          axis={"x"}
          index={parseInt(tab)}
          onChangeIndex={handleTabSwipe}
        >
          <TabPanel value="0" index={0} dir={"x"}>
            {selectedCity ? (
              <div>
                <h1>{selectedCity.toUpperCase()}</h1>
                <div class="list">
                  {restaurants.map((restaurant) => (
                    <Restaurant
                      restaurant={restaurant}
                      key={restaurant.id}
                      selected={
                        alreadyVotedId
                          ? alreadyVotedId === restaurant.id
                          : false
                      }
                      clickVote={voteRestaurant.bind(null, restaurant)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              ""
            )}
          </TabPanel>
          <TabPanel value="1" index={1} dir={"x"}>
            {voteResults.length ? <ResultsCard results={voteResults} /> : ""}
          </TabPanel>
        </SwipeableViews>
      </TabContext>
      {alreadyVotedId ? <div>Olet äänestänyt tänään {date}!</div> : ""}
      <ConfirmDialog
        handleClose={handleDialogClose}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        restaurant={proposedRestaurant}
        removingVote={
          proposedRestaurant ? alreadyVotedId === proposedRestaurant.id : false
        }
        handleVoteSuccess={handleVoteSuccess}
      />
    </Container>
  );
}
