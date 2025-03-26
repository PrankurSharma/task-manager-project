import { Drawer } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import TaskCard from "../components/TaskForm/TaskCard";

export default function RootDrawer () {
    const { openModal } = useContext(AppContext);
    return <Drawer anchor="bottom" open={openModal.open} sx={{
        ".MuiPaper-root": {
            display: "flex",
            // justifyContent: "center",
            overflow: "hidden",
            height: "80%"
        }
    }}>
        {openModal.open ? <TaskCard {...openModal.modalProps}/> : <></>}
    </Drawer>
}