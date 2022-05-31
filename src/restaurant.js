import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export const Restaurant = ({
  restaurant,
  selected = false,
  clickVote = () => {}
}) => {
  return (
    <Card sx={{ minWidth: 275, marginTop: 5 }} class="restaurant">
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Button
            onClick={clickVote}
            variant={selected ? "contained" : "outlined"}
            color="primary"
          >
            {restaurant.name}
          </Button>
          <Typography sx={{ mb: 4.5 }} color="text.secondary">
            <p>{restaurant.openingHours}</p>
          </Typography>
        </Stack>
        <div style={{ marginTop: 15 }}>
          {restaurant.dishes.map((dish) => (
            <div>
              {dish.name} {dish.price}
              {/* <Typography color="text.secondary"></Typography> */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
