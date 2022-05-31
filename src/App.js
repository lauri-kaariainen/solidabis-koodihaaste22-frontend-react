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

import citiesObj from "./cities.json";

// const city = "tampere";
const restaurantSearchUrl =
  "//lauri.space/solidabiskoodihaaste22/api/v1/restaurants/";

const voteResultsUrl = "//lauri.space/solidabiskoodihaaste22/api/v1/results/";

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  // const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [proposedRestaurant, setProposedRestaurant] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [voteResults, setVoteResults] = useState([]);
  const [alreadyVotedId, setAlreadyVotedId] = useState(null);
  const [date, setDate] = useState("");
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
      .then((json) => setVoteResults((json && json.results) || []));
  }, [selectedCity]);

  clearInterval(voteResultUpdateIntervalRef.current);
  voteResultUpdateIntervalRef.current = setInterval(() => {
    fetch(`${voteResultsUrl}`)
      .then((r) => r.json())
      .then((json) => setVoteResults((json && json.results) || []));
  }, 6000);

  const voteRestaurant = (restaurant) => {
    setProposedRestaurant(restaurant);
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
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
        {voteResults.length ? <ResultsCard results={voteResults} /> : ""}
      </Stack>
      {alreadyVotedId ? <div>Olet äänestänyt tänään {date}!</div> : ""}
      {selectedCity ? (
        <div>
          <h1>{selectedCity.toUpperCase()}</h1>
          <div class="list">
            {restaurants.map((restaurant) => (
              <Restaurant
                restaurant={restaurant}
                key={restaurant.id}
                selected={
                  alreadyVotedId ? alreadyVotedId === restaurant.id : false
                }
                clickVote={voteRestaurant.bind(null, restaurant)}
              />
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
      <ConfirmDialog
        handleClose={handleDialogClose}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        restaurant={proposedRestaurant}
        removingVote={
          proposedRestaurant ? alreadyVotedId === proposedRestaurant.id : false
        }
        // restaurantId={}
        // setActiveRestaurant={setActiveRestaurant}
        handleVoteSuccess={handleVoteSuccess}
      />
    </Container>
  );
}
