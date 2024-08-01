import React from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';

interface SidebarProps {
  title: string;
  bgColor?: string; // Optional background color prop
}

export default async function Sidebar({ title, bgColor = 'bg-gray-800' }: SidebarProps) {
  return (
    <div className={`h-screen w-64 ${bgColor} text-white fixed top-0 left-0 flex flex-col`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-2">
        <Button className="w-full text-left">Dashboard</Button>
        <Button className="w-full text-left">Settings</Button>
        <Button className="w-full text-left">Profile</Button>
      </nav>

      <div className='flex justify-end p-4'>
        <AuthButton />
      </div>
    </div>
  );
}

