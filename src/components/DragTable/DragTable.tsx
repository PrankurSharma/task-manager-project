import { statusType, Task } from "../../types/task";
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DraggableRow } from "./DraggableRow";
import { useContext, useRef } from "react";
import AddIcon from '@mui/icons-material/Add';
import { statusText } from "../../utils/helper";
import { useDroppable } from "@dnd-kit/core";

type DroppableSectionProps = {
    title: string;
    status: statusType;
    tasks: Task[];
    bgColor: string;
};

export const DroppableSection: React.FC<DroppableSectionProps> = ({ title, status, tasks, bgColor }) => {
    const tableRef = useRef<HTMLTableRowElement>(null);

    const { setNodeRef } = useDroppable({
        id: status
    });
    return (
        <TableRow>
            <TableCell style={{ borderBottom: "unset", padding: "0 0 32px 0" }} colSpan={5}>
                <Accordion defaultExpanded style={{ backgroundColor: "#f0f0f0", padding: "0", zIndex: "1" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ height: "48px", background: bgColor }}>
                        <Typography>{`${title} (${tasks.length})`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: "0", borderTop: '1px solid rgba(0, 0, 0, .125)', background: "#f1f1f1" }}>
                        <Table>
                            <TableBody ref={setNodeRef}>
                                {/* {status === "todo" && <TableRow>
                                    <TableCell colSpan={5}>
                                        <div style={{ display: "flex", alignItems: "center", width: "fit-content", marginLeft: "60px" }}>
                                            <AddIcon />
                                            <Typography>ADD TASK</Typography>
                                        </div>
                                    </TableCell>
                                </TableRow>} */}
                                {tasks.length > 0 ?
                                    tasks.map((task) => (
                                        <DraggableRow key={task.id} task={task} />
                                    )) :
                                    <TableRow ref={tableRef}>
                                        <TableCell colSpan={5} style={{ textAlign: "center", height: "158px" }}>No Tasks in {statusText[status]}</TableCell>
                                    </TableRow>}
                            </TableBody>
                        </Table>
                    </AccordionDetails>
                </Accordion>
            </TableCell>
        </TableRow>
    );
};
