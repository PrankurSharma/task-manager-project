import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addActivityLog, addAttachments, addTask, changeTasksStatus, deleteTasks, getLastPosition, updateTask } from "../api/taskApi";
import { Task } from "../types/task";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { statusText } from "../utils/helper";

export const useTaskApis = (addNewTask?: (lastPos: number) => void) => {
    const queryCient = useQueryClient();
    const { user, setAlertOptions } = useContext(AppContext);
    const addTaskMutation = useMutation({
        mutationFn: addTask,
        onSuccess: async (data, task) => {
            if (data) {
                addActivityLog([data.id], {
                    action: ` created the task.`,
                    user: user?.displayName ? user.displayName : ""
                });
                // if (user?.displayName) {
                //     addAttachments(data.id, task.attachments, user.displayName);
                // }
                setAlertOptions(alertOptions => ({
                    ...alertOptions,
                    open: true,
                    type: "success" as "success",
                    message: "Task created successfully."
                }));
            }
            else {
                console.log("No such document.");
            }
            queryCient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error) => {
            setAlertOptions(alertOptions => ({
                ...alertOptions,
                open: true,
                type: "error" as "error",
                message: error.message
            }));
        }
    });

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTasks,
        onSuccess: (_, taskIds) => {
            setAlertOptions(alertOptions => ({
                ...alertOptions,
                open: true,
                type: "success" as "success",
                message: `Task${taskIds.length > 0 ? "s" : ""} deleted successfully.`
            }));
            queryCient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error) => {
            setAlertOptions(alertOptions => ({
                ...alertOptions,
                open: true,
                type: "error" as "error",
                message: error.message
            }));
        }
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ tasks, task, fromDrag }: { tasks: Task[], task: Task, fromDrag: boolean }) => updateTask(tasks, task, fromDrag),
        onSuccess: (_, { tasks, task, fromDrag }) => {
            const myTask = tasks.find(t => t.id === task.id);
            if (myTask) {
                // if (user?.displayName) {
                //     addAttachments(myTask.id, myTask.attachments, user.displayName);
                // }
                addActivityLog([myTask.id], {
                    action: fromDrag ? ` moved task to ${statusText[myTask.status]}` : ` updated the task.`,
                    user: user?.displayName ? user.displayName : ""
                });
            }
            if (!fromDrag) {
                setAlertOptions(alertOptions => ({
                    ...alertOptions,
                    open: true,
                    type: "success" as "success",
                    message: "Task updated successfully."
                }));
            }
            queryCient.invalidateQueries({ queryKey: ["tasks"] })
        },
        onError: (error) => {
            setAlertOptions(alertOptions => ({
                ...alertOptions,
                open: true,
                type: "error" as "error",
                message: error.message
            }));
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ taskIds, status }: { taskIds: string[], status: Task["status"] }) => changeTasksStatus(taskIds, status),
        onSuccess: (_, { taskIds, status }) => {
            console.log("Moving...");
            addActivityLog(taskIds, {
                action: `changed status to ${statusText[status]}`,
                user: user?.displayName ? user.displayName : ""
            });
            if (taskIds.length > 1) {
                setAlertOptions(alertOptions => ({
                    ...alertOptions,
                    open: true,
                    type: "success" as "success",
                    message: `Tasks moved to ${statusText[status]}.`
                }));
            }
            queryCient.invalidateQueries({ queryKey: ["tasks"] })
        },
        onError: (error) => {
            setAlertOptions(alertOptions => ({
                ...alertOptions,
                open: true,
                type: "error" as "error",
                message: error.message
            }));
        }
    });

    const getLastPositionMutation = useMutation({
        mutationFn: getLastPosition,
        onSuccess: (lastPos) => {
            if (addNewTask) {
                addNewTask(lastPos);
            }
            queryCient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error) => {
            console.log("Last pos error...");
            setAlertOptions(alertOptions => ({
                ...alertOptions,
                open: true,
                type: "error" as "error",
                message: error.message
            }));
        }
    });

    return { addTaskMutation, deleteTaskMutation, updateTaskMutation, updateStatusMutation, getLastPositionMutation };
}