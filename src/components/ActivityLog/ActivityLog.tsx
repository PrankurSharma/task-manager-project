import { Card, CardContent, CardHeader, List, ListItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useActivityLog } from "../../hooks/useActivityLog";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { activityDate } from "../../utils/helper";

interface ActivityLogProps {
    id: string;
}

export default function ActivityLog({ id }: ActivityLogProps) {
    const { data, isLoading, error } = useActivityLog(id);
    const { user } = useContext(AppContext);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(768));

    return (
        <Card sx={{ height: isMobile ? "calc(100% - 58px) !important" : "100%", display: "flex", flexDirection: "column" }}>
            <CardHeader
                title="Activity"
                sx={{
                    "& .MuiCardHeader-title": {
                        fontSize: "16px",
                        fontWeight: "600",
                        lineHeight: "1.4",
                        fontStretch: "normal",
                        fontStyle: "normal",
                        letterSpacing: "normal",
                        textAlign: "left",
                        color: "rgba(0, 0, 0, 0.6)"
                    }
                }}
                style={{ borderBottom: "rgba(0, 0, 0, 0.13)" }}
            />
            <CardContent style={{ backgroundColor: "#f1f1f1", flexGrow: "1", overflow: "auto" }}>
                {(!isLoading && !error) ? <List>
                    {data?.map((log, idx) => <ListItem key={idx} sx={{
                        fontSize: "10px",
                        color: "#1E212A",
                        lineHeight: "1.4",
                        opacity: "0.8",
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <Typography style={{
                            fontSize: "12px",
                            color: "#1E212A",
                            lineHeight: "1.4",
                            opacity: "0.8",
                            marginRight: "10px"
                        }}>{log.user === user?.displayName ? "You" : log.user} {log.action}</Typography>
                        <Typography style={{
                            fontSize: "12px",
                            color: "#1E212A",
                            lineHeight: "1.4",
                            opacity: "0.5",
                            display: "flex",
                            justifyContent: "space-between"
                        }}>{activityDate(log.timestamp)}</Typography>
                    </ListItem>)}
                </List> : isLoading ? "Loading..." : "Something went wrong."}
            </CardContent>
        </Card>
    );
}