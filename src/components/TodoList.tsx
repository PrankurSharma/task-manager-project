import { Table } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function TodoList () {
    return (
       <DndProvider backend={HTML5Backend}>
            <Table></Table>
       </DndProvider>
    );
}