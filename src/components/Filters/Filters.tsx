import { Chip, InputAdornment, Link, Popover, Popper, TextField, Toolbar, Typography } from "@mui/material";
import { Button } from '@mui/base/Button';
import "./FiltersStyle.css";
import { KeyboardArrowDown, Search } from "@mui/icons-material";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Task } from "../../types/task";
import TaskMenu from "../Menu/TaskMenu";
import { categories, isSameDate } from "../../utils/helper";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const chipStyle = {
    marginRight: "10px",
    alignItems: "center",
    height: "30px",
    lineHeight: "1.4",
    fontSize: "12px",
    display: "flex",
    justifyContent: "center",
    ".MuiChip-label": {
        display: "flex",
        alignItems: "center"
    }
};

interface filter {
    category: string;
    search: string;
    dueOn: Date | null;
}

interface FilterInfo {
    filters: filter;
    setFilters: React.Dispatch<React.SetStateAction<filter>>
}

export default function Filters({ filters, setFilters } : FilterInfo) {
    const { setOpenModal, setMyTasks, tasks } = useContext(AppContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorCal, setAnchorCal] = useState<null | HTMLElement>(null);
    const openCal = Boolean(anchorCal);

    const open = Boolean(anchorEl);
    const handleAdd = () => {
        setOpenModal({
            open: true,
            modalProps: {
                update: false,
                updateData: {} as Task
            }
        });
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleToggleTask = (category: string) => {
        setFilters(filters => ({
            ...filters,
            category: category
        }));
        handleClose();
    };

    const handleDateChange = (value: any) => {
        setFilters(filters => ({
            ...filters,
            dueOn: value.toDate()
        }));
        handleClose();
    }

    // setting my tasks state in the filters component to update it everywhere

    useEffect(() => {
        console.log("Getting filters...", filters);
        let timeout: string | number | NodeJS.Timeout | undefined;
        if (tasks) {
            timeout = setTimeout(() => {
                const filteredTasks = tasks?.filter((task) => {
                    return (
                        (filters.search ? task.title.toLowerCase().includes(filters.search.toLowerCase()) : true) &&
                        (filters.category ? task.category === filters.category : true) &&
                        (filters.dueOn ? isSameDate(task.dueOn, filters.dueOn) : true)
                    )
                });
                setMyTasks([...filteredTasks]);
            }, 500);
        }

        return (() => clearTimeout(timeout));
    }, [tasks, filters]);

    return (
        <Toolbar className="filter-toolbar" style={{
            padding: "0"
        }}>
            <div className="toolbar-left">
                <Popover
                    open={openCal}
                    anchorEl={anchorCal}
                    anchorOrigin={{
                        vertical: "bottom",   // Aligns the popover to the top of the chip
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: "top", // Ensures the popover appears above the chip
                        horizontal: "center",
                    }}
                    onClose={() => setAnchorCal(null)}
                >
                    <DateCalendar onChange={handleDateChange} value={filters.dueOn ? dayjs(filters.dueOn) : null} />
                </Popover>
                <TaskMenu menuItems={categories} anchorEl={anchorEl} open={open} handleClose={handleClose} handleToggleTask={handleToggleTask} placement={"bottom"} selectedValue={filters.category} />
                <Typography className="filter-head">Filter by: </Typography>
                <div className="chips-div">
                    <Chip label={<>Category <KeyboardArrowDown style={{ fontSize: "18px" }} /></>} sx={chipStyle} variant="outlined" onClick={(event) => handleToggle(event as React.MouseEvent<HTMLDivElement>)} />
                    <Chip label={<>Due Date <KeyboardArrowDown style={{ fontSize: "18px" }} /></>} sx={chipStyle} variant="outlined" onClick={(event) => setAnchorCal(anchorCal ? null : event.currentTarget)} />
                    {(filters.category || filters.dueOn) && <Link sx={{color: "red", cursor: "pointer", fontSize: "10px"}} onClick={() => {
                        setFilters(filters => ({
                            ...filters,
                            category: "",
                            dueOn: null
                        }));
                    }}> Clear Filters </Link>}
                </div>
                <TextField
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            )
                        }
                    }}
                    placeholder="Search"
                    value={filters.search}
                    onChange={(e) => setFilters(filters => ({ ...filters, search: e.target.value }))}
                    className="search-input"
                />
            </div>
            <Button className="add-task" onClick={() => handleAdd()}>ADD TASK</Button>
        </Toolbar>
    );
}