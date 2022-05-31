import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export const ResultsCard = ({ results = [] }) => {
  console.log("rendering ResultsCard", results.length, results);
  return (
    <Card
      sx={{ minWidth: 275, marginTop: 5, maxHeight: 500, overflowY: "auto" }}
    >
      <CardContent>
        <Stack spacing={1}>
          <h2>Tulokset</h2>
          <List
            dense={true}
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              // overflowY: "scroll",
              maxHeight: 300,
              "& ul": { padding: 0 }
            }}
          >
            {results.map((res) => (
              <ListItem key={`item-${res.restaurantid}`}>
                <ListItemText
                  primary={`${res.name}, ${res.votes} ään${
                    res.votes > 1 ? "tä" : "i"
                  } `}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
        <h5>päivitetty: {new Date().toLocaleTimeString()}</h5>
      </CardContent>
    </Card>
  );
};
