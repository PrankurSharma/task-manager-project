import { Button, Card, CardContent, CardHeader, Container, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { CSSProperties } from "react";
import googleIcon from "../assets/Group 1171276158.svg";
import loginDesktop from "../assets/loginDesktop.svg";

const cardStyle: CSSProperties = {
    border: "none",
    boxShadow: "none",
    marginLeft: "80.75px",
    maxWidth: "fit-content",
    fontFamily: "Urbanist",
    background: "#fff9f9"
};

const contentStyle: CSSProperties = {
    fontSize: "11.6px",
    textAlign: 'left',
    color: "black",
    width: "294.61px",
    fontFamily: "Urbanist"
};

const btnStyle: CSSProperties = {
    width: "363.7px",
    height: "59.7px",
    flexGrow: "0",
    margin: "31.3px 0px 0px 2.2px",
    padding: "14.5px 59.8px 14.1px 58.9px",
    borderRadius: "18.9px",
    backgroundColor: "#292929",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
    fontFamily: "Urbanist"
}

export default function Signin() {
    const { loginMutation } = useAuth();
    const { mutate: login } = loginMutation;
    return (
        <Container style={{ 
            height: "100%", 
            display: "flex", 
            alignItems: "center", 
            backgroundImage: `url(${loginDesktop})`, 
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            minWidth: "100%" 
            }}>
            <Card style={cardStyle}>
                <CardHeader
                    title="TaskBuddy"
                    avatar={<AssignmentOutlinedIcon style={{ color: "#7b1984", fontSize: "27.3px", marginRight: "10.6px" }} />}
                    sx={{
                        paddingBottom: "0",
                        ".MuiCardHeader-avatar": {
                            marginRight: "0"
                        },
                        ".MuiTypography-root": {
                            width: "fit-content",
                            fontSize: "26.2px",
                            fontWeight: "bold",
                            lineHeight: "1.4",
                            color: "#7b1984"
                        },
                    }}
                />
                <CardContent style={{ paddingTop: "0" }}>
                    <Typography style={contentStyle}>Streamline your workflow and track progress effortlessly with our all-in-one task management app.</Typography>
                    <Button style={btnStyle} onClick={() => {
                        login();
                    }}>
                        <img src={googleIcon} style={{ marginRight: "11.6px" }}/>Continue with Google
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
}