"use client";
import React, { Suspense, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "../common/UserAvatar";
import dynamic from "next/dynamic";

const LogOutModal = dynamic(()=>import("../auth/LogoutModal"))

export default function ProfileMenu({
  name,
  image,
}: {
  name: string;
  image?: string;
}) {

    const [logOutOpen, setLogOutOpen ] = useState(false);

  return (
    <>
      {logOutOpen && <Suspense fallback={<p>Loading...</p>}>
        <LogOutModal open={logOutOpen} setOpen={setLogOutOpen}></LogOutModal>
      </Suspense>}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar name={name} image={image}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={()=>setLogOutOpen(true)}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </> 
  );
}
