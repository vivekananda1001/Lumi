"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { signIn } from 'next-auth/react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
  

const LoginModal = () => {
    const handleLogin = ()=>{
        signIn("google",{
            callbackUrl: '/dashboard',
            redirect: true,
        });
    }
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Getting Started</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Welcome to Lumi!</DialogTitle>
                        <DialogDescription>
                            Enjoy effortless task managing with your friendly assistant.
                        </DialogDescription>
                    </DialogHeader>
                    <Button variant="outline" onClick={handleLogin}>
                        <Image 
                            src="/images/google.png"
                            className="mr-4"
                            width={25}
                            height={25}
                            alt="google-logo"
                        />
                        Continue with Google
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LoginModal
