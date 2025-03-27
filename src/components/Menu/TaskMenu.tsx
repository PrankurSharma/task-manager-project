import { Menu, MenuItem } from "@mui/material";
import { statusType } from "../../types/task";

type menu = {
    label: string,
    value: string
}

interface MenuTypes {
    anchorEl: HTMLElement | null;
    open: boolean;
    handleClose: () => void;
    handleToggleTask?: (status: statusType) => void;
    menuItems: menu[];
    placement: number | "center" | "bottom" | "top";
    selectedValue?: string;
    customFunc?: (func: string) => void;
}

export default function TaskMenu({ anchorEl, open, handleClose, handleToggleTask, menuItems, placement, selectedValue, customFunc }: MenuTypes) {
    return (
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            onClick={(e) => e.stopPropagation()}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
                vertical: placement,   // Aligns the popover to the top of the chip
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: placement === "top" ? "bottom" : "top", // Ensures the popover appears above the chip
                horizontal: "center",
            }}
        >
            {menuItems.map((item) => <MenuItem key={item.value} selected={selectedValue?.includes(item.value)} onClick={() => {
                if (handleToggleTask) {
                    handleToggleTask(item.value as statusType);
                }
                else if (customFunc) {
                    customFunc(item.value);
                }
            }}>{item.label}</MenuItem>)}
        </Menu>
    );
}