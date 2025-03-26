import { Modal } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import TaskCard from "../components/TaskForm/TaskCard";

export default function RootModal () {
    const { openModal } = useContext(AppContext);
    return <Modal open={openModal.open}>
        {openModal.open ? <TaskCard {...openModal.modalProps}/> : <></>}
    </Modal>
}