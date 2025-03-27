// Draggable Task Row Component

import { statusType, Task } from "../../types/task";
import { Checkbox, Icon, IconButton, TableCell, TableRow, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { AppContext } from "../../context/AppContext";
import { convertShortDate, options, statusText } from "../../utils/helper";
import { useTaskApis } from "../../hooks/useTaskApis";
import TaskMenu from "../Menu/TaskMenu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type DraggableRowProps = {
    task: Task;
};

export const DraggableRow: React.FC<DraggableRowProps> = ({ task }) => {
    const [isItemSelected, setIsItemSelected] = useState<boolean>(false);
    const { selectedRows, setSelectedRows, setOpenModal, myTasks: updatedTasks, setMyTasks: setUpdatedTasks } = useContext(AppContext);
    const { deleteTaskMutation } = useTaskApis();
    const { mutate: deleteTasks } = deleteTaskMutation;


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id
    });

    const style = transform ? {
        transition,
        transform: CSS.Transform.toString(transform)
    } : undefined;


    useEffect(() => {
        if (!selectedRows.find(row => row.id === task.id)) {
            setIsItemSelected(false);
        }
    }, [selectedRows]);


    const onRowSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsItemSelected(event.target.checked);
        if (event.target.checked) {
            setSelectedRows((selectedRows) => [...selectedRows, task]);
        }
        else {
            setSelectedRows((selectedRows) => {
                return selectedRows.filter(row => row.id !== task.id);
            });
        }
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const dropdownFunc = (operation: string) => {
        if (operation === "Edit") {
            setOpenModal(openModal => ({
                ...openModal,
                open: true,
                modalProps: {
                    update: true,
                    updateData: task
                }
            }));
        }
        else {
            let tasks = [...updatedTasks];
            tasks = tasks.filter(t => t.id !== task.id);
            setUpdatedTasks([...tasks]);
            deleteTasks([task.id]);
        }
    }

    return (
        <TableRow selected={isItemSelected} ref={setNodeRef} style={{ ...style/*, visibility: isDragging ? "hidden" : "visible"*/, cursor: "pointer" }} onClick={(e) => {
            dropdownFunc("Edit");
            setSelectedRows([]);
        }}>
            <TableCell width={"37%"}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={onRowSelect}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <DragIndicatorIcon {...listeners} {...attributes} style={{ cursor: isDragging ? "grabbing" : "grab" }} className="hide-cell-mobile"/>
                    <CheckCircleIcon sx={{ color: task.status === "completed" ? "#1B8D17" : "#a7a7a7" }} />
                    <Typography sx={{ textDecoration: task.status === "completed" ? "line-through" : "none", marginLeft: "9px" }}>{task.title}</Typography>
                </div>
            </TableCell>
            <TableCell width={"21%"} className="hide-cell-mobile">{convertShortDate(task.dueOn)}</TableCell>
            <TableCell width={"21%"} className="hide-cell-mobile">{statusText[task.status]}</TableCell>
            <TableCell width={"21%"} className="hide-cell-mobile">{task.category}</TableCell>
            <TableCell style={{ textAlign: "right" }}>
                <IconButton onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(e);
                    setSelectedRows([]);
                }}>
                    <MoreHorizIcon />
                </IconButton>
                <TaskMenu menuItems={options} anchorEl={anchorEl} open={open} handleClose={handleClose} customFunc={dropdownFunc} placement={"bottom"} />
            </TableCell>
        </TableRow>
    );
};