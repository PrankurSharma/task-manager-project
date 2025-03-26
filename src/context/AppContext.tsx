import { createContext, useEffect, useState } from "react";
import { Task } from "../types/task";
import { useTasks } from "../hooks/useTasks";
import { User } from "firebase/auth";
import { useUserInfo } from "../hooks/useUserInfo";

interface ModalProps {
    open: boolean,
    modalProps: { update: boolean, updateData: Task }
}

interface ContextType {
    selectedRows: Array<Task>;
    setSelectedRows: React.Dispatch<React.SetStateAction<Array<Task>>>;
    myTasks: Task[];
    setMyTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    openModal: ModalProps;
    setOpenModal: React.Dispatch<React.SetStateAction<ModalProps>>;
    tasks: Task[] | undefined;
    user: User | null | undefined,
    alertOptions: AlertOptions,
    setAlertOptions: React.Dispatch<React.SetStateAction<AlertOptions>>
} 

interface AlertOptions {
    message: string;
    type: "success" | "error" | "warning";
    open: boolean;
}

export const AppContext = createContext<ContextType>({} as ContextType);

interface PropsType {
    children: React.ReactNode
}

export const ContextProvider = (props: PropsType) => {
    const [selectedRows, setSelectedRows] = useState<Array<Task>>([]);
    const [myTasks, setMyTasks] = useState<Array<Task>>([]);
    const [openModal, setOpenModal] = useState<ModalProps>({ open: false, modalProps: { update: false, updateData: {} as Task } });
    const [alertOptions, setAlertOptions] = useState({} as AlertOptions);

    const { data: user, isLoading: loadingUser, error: userError } = useUserInfo();

    const { data: tasks, isLoading, error } = useTasks();

    console.log("Loading: ", user);

    useEffect(() => {
        if (error || userError) {
            setAlertOptions(alertOptions => ({
                ...alertOptions,
                open: true,
                type: "error" as "error",
                message: error ? error?.message ? error.message : "" : userError ? userError?.message ? userError.message : "" : ""
            }));
        }
    }, [error, userError]);


    if (isLoading || loadingUser) {
        return "Loading...";
    }
    return <AppContext.Provider value={{
        selectedRows, setSelectedRows,
        myTasks, setMyTasks,
        openModal, setOpenModal,
        tasks, user,
        alertOptions, setAlertOptions
    }}>
        {props.children}
        </AppContext.Provider>
}