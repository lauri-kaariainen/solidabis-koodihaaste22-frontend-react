// import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export const ResultsCard = ({
  results = []
  // selected = false,
  // clickVote = () => {}
}) => {
  return (
    <Card
      sx={{ minWidth: 275, marginTop: 5, maxHeight: 500, overflowY: "auto" }}
    >
      <CardContent>
        <Stack spacing={1}>
          <h2>Tulokset</h2>
          {results.map((res) => (
            // <Button variant="outlined" color="primary">
            //   {res.name}, {res.votes} ään{res.votes > 1 ? "tä" : "i"}
            // </Button>
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
              <ListItem key={`item-${res.name}`}>
                <ListItemText
                  primary={`${res.name}, ${res.votes} ään${
                    res.votes > 1 ? "tä" : "i"
                  } `}
                />
              </ListItem>
            </List>
            // {res.dishes.map((dish) => (
            //   <div>
            //     {dish.name} {dish.price}
            //   </div>
            // ))}
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
