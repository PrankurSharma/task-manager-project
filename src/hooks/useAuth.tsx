import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithPopup, signOut } from "firebase/auth";

import  { auth, googleProvider } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const useAuth = () => {
    const { setAlertOptions } = useContext(AppContext);
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async () => {
            await signInWithPopup(auth, googleProvider);
        },
        onSuccess: () => {
            setAlertOptions(alertOptions => ({
                ...alertOptions,
                open: true,
                type: "success" as "success",
                message: "Signed in successfully."
            }));
            queryClient.invalidateQueries({ queryKey: ["user"] });
            navigate("/");
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

    // const registerMutation = useMutation<User, Error, { email: string, password: string }>({
    //     mutationFn: async ({ email, password }) => {
    //         const userCredentails = await createUserWithEmailAndPassword(auth, email, password);
    //         return userCredentails.user;
    //     },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ["user"] });
    //     }
    // });

    const logoutMutation = useMutation<void, Error>({
        mutationFn: async () => {
            await signOut(auth);
        },
        onSuccess: () => {
            setAlertOptions(alertOptions => ({
                ...alertOptions,
                open: true,
                type: "success" as "success",
                message: "Logged out successfully."
            }));
            navigate("/signin");
            queryClient.invalidateQueries({ queryKey: ["user"] });
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

    return { loginMutation, logoutMutation/*, registerMutation*/ };
}