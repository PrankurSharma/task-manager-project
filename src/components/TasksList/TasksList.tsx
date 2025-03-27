import { segregateTasks, statuses } from "../../utils/helper";
import { useContext, useEffect, useState } from "react";
import { Container, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, useMediaQuery, useTheme } from "@mui/material";
import ActionBar from "../ActionBar";
import { AppContext } from "../../context/AppContext";
import Board from "../BoardView/Board";
import { DroppableSection } from "../DragTable/DragTable";
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import Filters from "../Filters/Filters";
import { Button } from "@mui/base";
import { useAuth } from "../../hooks/useAuth";
import LogoutIcon from '@mui/icons-material/Logout';

import { statusType, Task } from "../../types/task";
import { closestCorners, DragEndEvent, DragOverEvent, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useTaskApis } from "../../hooks/useTaskApis";
import notFound from "../../assets/NotFound.svg";
import "./TasksList.css";

interface filter {
    category: string;
    search: string;
    dueOn: Date | null;
}


const TasksList = () => {
    const { myTasks, setMyTasks, selectedRows, setSelectedRows } = useContext(AppContext);
    const { todo, inProgress, completed } = segregateTasks(myTasks || []);
    const [tabSelected, setTabSelected] = useState(1);
    const [filters, setFilters] = useState<filter>({
        category: "",
        search: "",
        dueOn: null
    });
    const { logoutMutation } = useAuth();

    const { mutate: logout, error } = logoutMutation;
    const { updateTaskMutation } = useTaskApis();
    const { mutate: updateTask } = updateTaskMutation;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(768));

    useEffect(() => {
        if (isMobile) {
            setTabSelected(1);
        }
    }, [isMobile]);

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    })
    const sensors = useSensors(mouseSensor);

    const reorderTasks = (tasks: Task[], draggedId: string, targetId: string): Task[] => {
        const updatedTasks = [...tasks];
        const draggedIndex = updatedTasks.findIndex((task) => task.id === draggedId);
        const targetIndex = updatedTasks.findIndex((task) => task.id === targetId);

        if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
            const [movedTask] = updatedTasks.splice(draggedIndex, 1);
            updatedTasks.splice(targetIndex, 0, movedTask);
        }

        return updatedTasks.map((task, index) => ({ ...task, position: index }));
    };

    const handleDragTask = async (event: DragOverEvent) => {
        if (!event.over) return;

        const draggedId = event.active.id as string;
        const targetId = event.over.id as string;

        let updatedTasks = [...myTasks];

        const draggedTask = updatedTasks.find((task) => task.id === draggedId);
        const targetTask = updatedTasks.find((task) => task.id === targetId);

        if (!draggedTask) return;

        if (targetTask) {
            if (draggedTask.draggableId !== targetTask.draggableId) {
                draggedTask.status = targetTask.status;
            }
            const newTasks = reorderTasks(updatedTasks, draggedId, targetId);
            setMyTasks(newTasks);
        }
        else {
            const targetColumn = statuses.find(status => status.value === targetId);
            if (targetColumn) {
                draggedTask.status = targetColumn.value as statusType;
                updatedTasks = updatedTasks.map((task, idx) => ({ ...task, position: idx }));
                setMyTasks([...updatedTasks]);
            }
        }
    };

    const onDragEnd = () => {
        let myTask = {} as Task;
        console.log("Drag end update...");
        let updatedTasks = [...myTasks];
        updatedTasks.forEach(task => {
            if (task.draggableId !== task.status) {
                task.draggableId = task.status;
                myTask = { ...task };
            }
        });
        updateTask({ tasks: myTasks, task: myTask, fromDrag: true });
    }

    return (
        <Container sx={{
            maxWidth: "100% !important",
            padding: "0 30px 30px 30px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: tabSelected === 2 ? "hidden" : "auto",
            background: "white",
            zIndex: "500"
        }}>
            <div style={{ position: "sticky", top: "0", background: "white", zIndex: "2" }}>
                <Tabs
                    value={tabSelected}
                    className="task-tabs hide-cell-mobile"
                    onChange={(_, newVal) => {
                        setTabSelected(newVal);
                        setSelectedRows([]);
                    }}
                >
                    <Tab label="List" value={1} icon={<ViewListRoundedIcon />} iconPosition="start" />
                    <Tab label="Board" value={2} icon={<AssignmentOutlinedIcon />} iconPosition="start" />
                </Tabs>
                <Button className="logout-btn" onClick={() => logout()}><LogoutIcon style={{ fontSize: "15px", transform: "rotate(180deg)", marginRight: "7px" }} />Logout</Button>

                <Filters filters={filters} setFilters={setFilters}/>
            </div>
            
            {(myTasks.length > 0 || (myTasks.length === 0 && !filters.category && !filters.dueOn && !filters.search)) && <DndContext collisionDetection={closestCorners} onDragOver={handleDragTask} onDragEnd={onDragEnd} sensors={sensors}>
                <SortableContext items={myTasks}>
                    {tabSelected === 1 && <Table>
                        <TableHead>
                            <TableRow className="hide-cell-mobile">
                                <TableCell width={"37%"}>Task Name</TableCell>
                                <TableCell width={"21%"}>Due On</TableCell>
                                <TableCell width={"21%"}>Task Status</TableCell>
                                <TableCell width={"21%"}>Task Category</TableCell>
                                <TableCell>
                                    <div style={{ width: "72px" }}></div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="table-body">
                            <DroppableSection title="Todo" bgColor="#fac3ff" status="todo" tasks={todo} />
                            <DroppableSection title="In-Progress" bgColor="#85d9f1" status="inprogress" tasks={inProgress} />
                            <DroppableSection title="Completed" bgColor="#ceffcc" status="completed" tasks={completed} />
                        </TableBody>
                    </Table>}
                    {tabSelected === 2 && <Container style={{ display: "flex", flexWrap: "wrap", flex: "1", maxWidth: "100%", padding: "0", minHeight: "0" }}>
                        <Board key={"todo"} status="todo" bgColor="#FAC3FF" tasks={todo} />
                        <Board key={"inprogress"} status="inprogress" bgColor="#85D9F1" tasks={inProgress} />
                        <Board key={"completed"} status="completed" bgColor="#A2D6A0" tasks={completed} />
                    </Container>}
                </SortableContext>
            </DndContext>}

            {myTasks.length === 0 && (filters.category || filters.dueOn || filters.search) && 
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%", 
                height: "100%"
            }}>
            <img src={notFound} style={{
                maxWidth: "430px",
                maxHeight: "309px",
                width: "100%"
            }}/>
            </div>}
            {selectedRows.length > 0 && <ActionBar />}
        </Container>
    );
}

export default TasksList;