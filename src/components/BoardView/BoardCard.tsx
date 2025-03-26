import { Card, CardActionArea, CardActions, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import { Task } from "../../types/task";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { convertShortDate, options } from "../../utils/helper";
import TaskMenu from "../Menu/TaskMenu";
import { useTaskApis } from "../../hooks/useTaskApis";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CardProps {
    task: Task;
}
export default function BoardCard({ task }: CardProps) {


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { setOpenModal, myTasks: updatedTasks, setMyTasks: setUpdatedTasks } = useContext(AppContext);

    const { deleteTaskMutation } = useTaskApis();
    const { mutate: deleteTasks } = deleteTaskMutation;

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
            id: task.id
        });
    
        const style = transform ? {
            transition,
            transform: CSS.Transform.toString(transform)
        } : undefined;

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
        <Card ref={setNodeRef} {...attributes} {...listeners} sx={{ ...style, maxWidth: "336px", marginBottom: "8px", /*visibility: isDragging ? "hidden" : "visible"*/ }}>
            <CardActionArea onClick={() => {
                setOpenModal({
                    open: true,
                    modalProps: {
                        update: true,
                        updateData: task,
                    }
                });
            }}>
                <CardHeader
                    title={task.title}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        ".MuiTypography-root": {
                            textAlign: "left",
                            maxWidth: "225px",
                            wordBreak: "break-all"
                        }
                    }}
                    action={<>
                        <IconButton onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(e);
                        }}>
                            <MoreHorizIcon />
                        </IconButton>
                        <TaskMenu menuItems={options} anchorEl={anchorEl} open={open} handleClose={handleClose} customFunc={dropdownFunc} placement={"bottom"} />
                    </>}
                />
                <CardContent>
                    <CardActions sx={{
                        padding: "0",
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <Typography>{task.category}</Typography>
                        <Typography>{convertShortDate(task.dueOn)}</Typography>
                    </CardActions>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}