'use client';
import Image from "next/image";
import Login from "@/app/components/Login";
import Sidebar from "@/app/components/SideBar";

export default function LoginPage() {
  return (
          <main className={"flex h-screen justify-center items-center"}>
              <Login/>
          </main>

  );
}
