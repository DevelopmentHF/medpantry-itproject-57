import React from 'react';
import Taskbar from './Taskbar';
import AuthButton from '@/components/AuthButton';

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
      <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center">
        <AuthButton />
        <a href="../protected">Go back</a>
      </nav>
      <div className="flex w-full">
        <Taskbar />
        <div className="flex-1 p-6">
          <h1 className="font-bold text-4xl">Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;