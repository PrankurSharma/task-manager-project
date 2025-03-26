import { Snackbar, Alert as SimpleAlert, SnackbarCloseReason } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";



export default function Alert() {
    const { alertOptions, setAlertOptions } = useContext(AppContext);

    const handleClose = () => {
        setAlertOptions(alertOptions => ({
            ...alertOptions,
            open: false
        }));
    };
    return (
        <Snackbar
            open={alertOptions.open}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center"
            }}
            sx={{
                transform: "translateY(50px)"
            }}
        >
            <SimpleAlert
                severity={alertOptions.type}
                // onClose={handleClose}
                onClose={handleClose}
                variant="filled"
                sx={{ width: "100%", maxWidth: "500px" }}
            >
                {alertOptions.message}
            </SimpleAlert>
        </Snackbar>
    );
}