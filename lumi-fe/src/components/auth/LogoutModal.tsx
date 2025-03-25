"use client"
import React, { Dispatch, SetStateAction } from "react";
import { signOut } from "next-auth/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LogoutModal = ({open, setOpen}: {open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) => {
    const handleLogout = ()=>{
        signOut({
            redirect: true,
            callbackUrl: '/'
        })
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the current
                session from your device.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    );
};

export default LogoutModal;
