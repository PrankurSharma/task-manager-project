import { AppBar, Avatar, Toolbar, Typography } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import "./TopbarStyle.css";

export default function Topbar() {
    const { user } = useContext(AppContext);
    return (
        <AppBar position="sticky" className="topbar">
            <Toolbar>
            <AssignmentOutlinedIcon style={{ color: "#2f2f2f", fontSize: "29px", marginRight: "5.42px" }} className="hide-cell-mobile"/>
                <Typography className="topbar-head">TaskBuddy</Typography>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                }}>
                    <Avatar src={user?.photoURL ? user.photoURL : ""} sx={{
                        width: "36px",
                        height: "36px"
                    }}/>
                    <Typography className="hide-cell-mobile" style={{ color: "rgba(0, 0, 0, 0.6)", marginLeft: "8px" }}>{user?.displayName}</Typography>
                </div>
            </Toolbar>
        </AppBar>
    );
}