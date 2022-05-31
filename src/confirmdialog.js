import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

export const ConfirmDialog = ({
  handleClose,
  openDialog,
  restaurant = { name: "Virhe" },
  handleVoteSuccess
}) => {
  const handleSuccess = () => {
    handleVoteSuccess(restaurant);
    handleClose();
  };

  return (
    <Dialog
      sx={{ textAlign: "center" }}
      onClose={handleClose}
      open={openDialog}
    >
      <DialogTitle>Äänestä ravintolaa?</DialogTitle>
      <p
        style={{
          fontSize: "85%",
          width: "80%",
          wrap: "ellipsis",
          margin: "auto"
        }}
      >
        {restaurant ? restaurant.name : ""}
      </p>
      <Button color="success" onClick={handleSuccess}>
        Kyllä
      </Button>
    </Dialog>
  );
};
