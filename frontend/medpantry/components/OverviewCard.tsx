import React from 'react';

interface CardProps {
  title: string;
  count: number;
  description: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, count, description, icon }) => {
  return (
    <div className="p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow space-y-5">
      <div className="flex items-center space-x-3">
        {icon && <div className="text-4xl  text-red-600">{icon}</div>}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-s text-foreground">{description}</p>
    </div>
  );
};

export default Card;