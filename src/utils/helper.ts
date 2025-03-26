import { Task } from "../types/task";

export const segregateTasks = (tasks: Task[]) => {
    return {
        todo: tasks.filter(task => task.status === "todo"),
        inProgress: tasks.filter(task => task.status === "inprogress"),
        completed: tasks.filter(task => task.status === "completed")
    };
}

export const statuses = [
    {
        label: "TO-DO",
        value: "todo"
    },
    {
        label: "IN-PROGRESS",
        value: "inprogress"
    },
    {
        label: "COMPLETED",
        value: "completed"
    }
];

export const options = [
    {
        label: "Edit",
        value: "Edit",
    },
    {
        label: "Delete",
        value: "Delete"
    }
];

export const statusText: { [key: string]: string } = {
    todo: "To Do",
    inprogress: "In Progress",
    completed: "Completed",
};

export const convertShortDate = (date: Date | null | undefined) => {
    if (date) {
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).replace(" ", ", ");
    }
    else {
        return;
    }
};

export const isSameDate = (d1: Date | null | undefined, d2: Date | null | undefined) => {
    if (d1 && d2) {
        return d1.toISOString().split("T")[0] === d2.toISOString().split("T")[0];
    }
    else {
        return;
    }
}

export const activityDate = (date: Date | null | undefined) => {
    if (date) {
        const formattedDate = date.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
        return formattedDate.replace(", ", " at ");
    }
    else {
        return;
    }
}

export const categories = [
    {
        label: "Work",
        value: "Work"
    },
    {
        label: "Personal",
        value: "Personal"
    }
];