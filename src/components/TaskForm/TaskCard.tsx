import { Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, IconButton, MenuItem, Modal, Select, TextField, Typography, TypographyTypeMap, useMediaQuery, useTheme } from "@mui/material";
import { Button } from '@mui/base/Button';
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextEditor from "./TextEditor";
import Grid from '@mui/material/Grid2';
import dayjs from "dayjs";
import { statuses } from "../../utils/helper";
import { ExpandMoreOutlined } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import { statusType, Task } from "../../types/task";
import { Editor } from "@tiptap/react";
import { useTaskApis } from "../../hooks/useTaskApis";
import ActivityLog from "../ActivityLog/ActivityLog";
import Dropzone from "./Dropzone";
import { useAttachments } from "../../hooks/useAttachments";

interface TaskCadProps {
    update: boolean;
    updateData: Task
}

export default function TaskCard({ update, updateData }: TaskCadProps) {
    const { setOpenModal } = useContext(AppContext);
    const initialData = update ? { ...updateData } : {
        title: '',
        description: { type: 'doc', content: [{ type: 'paragraph' }] },
        category: '',
        dueOn: null,
        draggableId: '' as statusType,
        status: '' as statusType,
        attachments: []
    };
    const [data, setData] = useState<Omit<Task, "position" | "id"> | Task>({ ...initialData });
    const [tabSelected, setTabSelected] = useState("");

    const addNewTask = (lastPos: number) => {
        addTask({ ...data, position: lastPos + 1 } as Task);
        closeModal();
    }

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(768));

    const { addTaskMutation, updateTaskMutation, getLastPositionMutation } = useTaskApis(addNewTask);

    const { mutate: addTask } = addTaskMutation;

    const { mutate: updateTask } = updateTaskMutation;

    const { mutate: getLastPosition } = getLastPositionMutation;

    const { data: attachments, isLoading, error: attachmentError } = useAttachments(update ? updateData.id : "");

    const [error, setError] = useState("");

    const errorRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        console.log("Getting attachments...", attachments);
        setData(data => ({
            ...data,
            attachments: attachments as File[]
        }));
    }, [attachments]);


    const handleChange = (e: any) => {
        setData(data => ({ ...data, [e.target.name]: e.target.value }));
    }

    const handleEditorChange = (e: Editor) => {
        setData(data => ({ ...data, description: e.getJSON() }))
    }

    const handleProceed = async () => {
        if (!data.title) {
            setError("Please enter title of the task.");
            errorRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }
        else if (!data.category) {
            setError("Please select a category for the task.");
        }
        else if (!data.dueOn) {
            setError("Please select a due date for the task.");
        }
        else if (!data.status) {
            setError("Please select a task status.");
        }
        else {
            if (update) {
                updateTask({ tasks: [{ ...data } as Task], task: { ...data } as Task, fromDrag: false });
                closeModal();
            }
            else {
                getLastPosition();
            }
        }
    }
    const closeModal = () => {
        setOpenModal({
            open: false,
            modalProps: {
                update: false,
                updateData: {} as Task
            }
        });
    }

    useEffect(() => {
        if (!isMobile) {
            setTabSelected("");
        }
        else {
            setTabSelected("Details");
        }
    }, [isMobile]);

    return (
        <Card className="form-card" sx={{
            // width: update ? "1026px" : "674px",
            // height: update ? "575px" : "696px"
            display: "flex",
            flexDirection: "column",
            maxHeight: "696px",
            height: "100% !important",
            minWidth: isMobile ? "auto" : "575px"
        }}>
            <CardHeader
                title={update ? "" : "Create Task"}
                sx={{
                    borderBottom: "1px solid rgba(0, 0, 0, 0.10)"
                }}
                action={
                    <IconButton onClick={closeModal}>
                        <CloseIcon />
                    </IconButton>
                }
            />
            <CardContent style={{ display: "flex", flexDirection: "column", padding: "0", minHeight: "0", flexGrow: "1" }}>
            {update && <Grid className="hide-cell-desktop" size={{ xs: 12, sm: 12 }} sx={{
                        padding: "20px",
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <Button className={tabSelected === "Details" ? "tab-style-selected" : "tab-style"} onClick={() => {
                            setTabSelected("Details");
                        }}>DETAILS</Button>
                        <Button className={tabSelected === "Activity" ? "tab-style-selected" : "tab-style"} onClick={() => {
                            setTabSelected("Activity");
                        }}>ACTIVITY</Button>
                    </Grid>}
                <Grid container sx={{ flexGrow: 1, minHeight: "0", overflow: "auto" }}>
                    {((!isMobile) || (isMobile && tabSelected === "Details")) && <Grid size={{ md: update ? 7 : 12 }} sx={{
                        padding: "20px",
                        // minHeight: "0",
                        width: "100%",
                        // flexGrow: "1",
                        height: "100%",
                        overflow: "auto",
                    }}>
                        <Grid size={{ md: 12 }}>
                            <TextField
                                placeholder="Task Title"
                                className="outer-form-field"
                                required
                                name="title"
                                onChange={handleChange}
                                defaultValue={data.title}
                                sx={{
                                    marginBottom: "13px"
                                }}
                            />
                        </Grid>
                        <Grid size={{ md: 12 }} sx={{ marginBottom: "22px" }}>
                            <TextEditor handleUpdate={handleEditorChange} content={data.description} />
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
                                <Typography className="form-labels">Task Category*</Typography>
                                <Chip label="Work" sx={{ 
                                    marginRight: "10px", 
                                    background: data.category === "Work" ? "#7B1984" : "white", 
                                    color:  data.category === "Work" ? "white" : "black",
                                    border: "1px solid rgba(0, 0, 0, 0.19)"
                                }} onClick={() => {
                                    setData(data => ({ ...data, category: "Work" }));
                                }} />
                                <Chip label="Personal" sx={{
                                    background: data.category === "Personal" ? "#7B1984" : "white", 
                                    color:  data.category === "Personal" ? "white" : "black",
                                    border: "1px solid rgba(0, 0, 0, 0, 0.19)"
                                }} onClick={() => {
                                    setData(data => ({ ...data, category: "Personal" }));
                                }} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
                                <Typography className="form-labels">Due On*</Typography>
                                <DatePicker className="form-field" defaultValue={data.dueOn ? dayjs(data.dueOn) : null} onChange={(value) => {
                                    setData(data => ({ ...data, dueOn: value ? value.toDate() : null }));
                                }} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
                                <Typography className="form-labels">Task Status*</Typography>
                                <Select displayEmpty className="form-field" defaultValue={data.status} onChange={(e) => {
                                    console.log("On change called", e.target.value);
                                    if (e.target.value) {
                                        setData(data => ({ ...data, status: e.target.value as statusType, draggableId: e.target.value as statusType }));
                                    }
                                }} IconComponent={ExpandMoreOutlined}>
                                    <MenuItem disabled value="Choose">
                                        <em>Choose</em>
                                    </MenuItem>
                                    {statuses.map((status) => <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>)}
                                </Select>
                            </Grid>
                        </Grid>
                        <Grid size={{ md: 12 }} sx={{ marginBottom: "22px", marginTop: "20px" }}>
                        <Typography className="form-labels">Attachment</Typography>
                            <Dropzone data={data} setData={setData}/>
                        </Grid>
                        {error && <Typography ref={errorRef} className="error-text">{'* ' + error}</Typography>}
                    </Grid>}
                    {((update && !isMobile) || (isMobile && update && tabSelected === "Activity")) ? <Grid size={{ xs: 12, sm: 12, md: 5 }} sx={{
                        minHeight: "0", height: "100%"
                    }}>
                        <ActivityLog id={updateData.id} />
                    </Grid> : <></>}
                </Grid>
            </CardContent>

            <CardActions className="card-actions">
                <Button className="cancel-btn" onClick={() => closeModal()}>CANCEL</Button>
                <Button className="confirm-btn" onClick={() => handleProceed()}>{update ? "UPDATE" : "CREATE"}</Button>
            </CardActions>
        </Card>
    );
}