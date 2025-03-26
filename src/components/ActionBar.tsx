import { AppBar, Chip, IconButton, Stack, Toolbar } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import CloseIcon from '@mui/icons-material/Close';
import { LibraryAddCheck } from "@mui/icons-material";
import { useTaskApis } from "../hooks/useTaskApis";
import { statuses } from "../utils/helper";
import TaskMenu from "./Menu/TaskMenu";
import { statusType } from "../types/task";

export default function ActionBar() {
    const { selectedRows, setSelectedRows, myTasks, setMyTasks } = useContext(AppContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { deleteTaskMutation, updateStatusMutation } = useTaskApis();

    const { mutate: deleteTasks } = deleteTaskMutation;
    const { mutate: updateTaskStatus } = updateStatusMutation;

    const [filters, setFilters] = useState({
        status: ""
    });

    const onDeleteClick = () => {
        let tasks = [...myTasks];
        selectedRows.forEach((row) => {
            tasks = tasks.filter(task => task.id !== row.id);
        });
        tasks = tasks.map((task, idx) => task.position !== idx ? { ...task, position: idx } : task);
        setMyTasks(tasks);
        deleteTasks(selectedRows.map((row) => row.id));
        setSelectedRows([]);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleToggleTask = (status: statusType) => {
        const tasks = [...myTasks];
        setFilters(filters => ({
            ...filters,
            status: status
        }));
        selectedRows.forEach((row) => {
            console.log("Row select: ", row, tasks);
            tasks[row.position].status = status as statusType;
            tasks[row.position].status = status as statusType;
        });
        setMyTasks(tasks);
        updateTaskStatus({ taskIds: selectedRows.map(row => row.id), status: status as statusType });
        setSelectedRows([]);
        handleClose();
    }


    return (
        <Stack direction="row" spacing={2}>
            <TaskMenu menuItems={statuses} anchorEl={anchorEl} open={open} handleClose={handleClose} handleToggleTask={handleToggleTask} placement={"top"} selectedValue={filters.status}/>
            <AppBar position="fixed" sx={{ top: 'auto', bottom: "20px", left: "50%", transform: "translateX(-50%)", background: "#1A1C20", borderRadius: "12px", width: "365px", height: "52px" }}>
                <Toolbar style={{ padding: "10px", height: "52px", minHeight: "0", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Chip label={<>{selectedRows.length} Tasks Selected
                            <IconButton onClick={() => {
                                setSelectedRows([]);
                            }}>
                                <CloseIcon style={{ fontSize: "15px", color: "white" }} />
                            </IconButton>
                        </>} variant="outlined" style={{ borderColor: "#ffffff", color: "#ffffff", width: "fit-content", textAlign: "center", fontSize: "12px", height: "27px", marginRight: "8px" }} />
                        <LibraryAddCheck style={{ fontSize: "16px" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Chip id="status"
                            label="Status"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            style={{ background: "rgba(141, 138, 138, 0.14)", borderColor: "#ffffff", width: "fit-content", color: "#ffffff", height: "27px", marginRight: "8px", cursor: "pointer" }}
                            onClick={(event) => handleToggle(event as React.MouseEvent<HTMLDivElement>)} />
                        <Chip label="Delete" style={{ background: "rgba(255, 53, 53, 0.14)", width: "fit-content", color: "#E13838", height: "27px", cursor: "pointer" }} onClick={onDeleteClick} />
                    </div>
                </Toolbar>
            </AppBar>
        </Stack>
    );
}