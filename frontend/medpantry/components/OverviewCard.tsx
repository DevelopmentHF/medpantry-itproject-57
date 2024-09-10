import React from 'react';

interface CardProps {
  title: string;
  count: number;
  description: string;
}

const Card: React.FC<CardProps> = ({ title, count, description }) => {
  return (
    <div className="p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow space-y-5">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-s text-foreground">{description}</p>
    </div>
  );
};

export default Card;