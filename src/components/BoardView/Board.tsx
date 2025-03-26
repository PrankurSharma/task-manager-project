import { Paper, Typography } from "@mui/material";
import { statusType, Task } from "../../types/task";
import BoardCard from "./BoardCard";
import { statusText } from "../../utils/helper";
import { useDroppable } from "@dnd-kit/core";

interface BoardProps {
    tasks: Task[];
    status: statusType;
    bgColor: string;
}

export default function Board(props: BoardProps) {
    const { tasks, status, bgColor } = props;

    const { setNodeRef } = useDroppable({
            id: status
        });

    const statusStyle: React.CSSProperties = { 
        background: bgColor, 
        width: "fit-content", 
        height: "28px", 
        padding: "4px 10px", 
        borderRadius: "4px", 
        marginBottom: "20px", 
        position: "sticky", 
        top: "0" 
    };

    return (
        <Paper ref={setNodeRef} style={{ padding: "12px", minWidth: "355px", background: "rgba(88, 87, 81, 0.07)", marginRight: "24px", height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography style={statusStyle}>{statusText[status]}</Typography>
            <div style={{overflowY: "auto", flex: "1", minHeight: "0"}}>
            {tasks.length === 0 ? <Typography>No tasks in {statusText[status]}</Typography> : null}
            {tasks.map((task) => <BoardCard key={task.id} task={task} />)}
            </div>
        </Paper>
    );
}