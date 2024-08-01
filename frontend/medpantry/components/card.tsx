// Import relevant components from elsewhere in the project.
// React/NextJS aim to build a website with lots of modular components.
// Here, we are making a 'Card' component, that we could reuse elsewhere if we made it generic enough
import React from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';
import { Separator } from './ui/separator';

// These are the properties of our component that we can pass in when we use it elsewhere.
// Once we define them here, we can use them like so ...
// `<Card title="Needles" bgColor="bg-secondary" quantity="5" sku="494">`
interface CardProps {
  title: string;
  bgColor?: string; // Optional background color prop
  quantity: string;
  sku: string;
}

// The actual code for what goes in the component and how it looks is here.
// We have to 'export default' the component so other pages/components can see it.
//
// Components in react are functions, its a bit weird but we can just follow this recipe:
export default function Card({ title, quantity, sku, bgColor = 'bg-card' }: CardProps) {

    // we can put javascript code here to do calculations etc that we might need down below
    // there's nothing needed here at the moment because I've hardcoded things. 
    //      -> see AuthButton.tsx for examples of javascript code in this spot.

  return (  // export 1 and only 1 div out of the function

    // most external div is our outer container for the card.
    // Inside the className of an element, we use TailwindCSS to define what it LOOKS like
    //      So here, the external div has a background colour set via a prop, a solid border,
    //      a border colour called border, medium rounded edges, padding of 4 units,
    //      its inner elements flexible in a column layout (google flexbox), with its inner elements having
    //      a gap of 2 units
    <div className={`${bgColor} border-solid border-border rounded-md p-4 flex flex-col gap-2`}>
        <div className="">
            <h1 className="text-2xl">{title}</h1>
        </div>
        <Separator className='bg-secondary-foreground'></Separator>
        <div>
            <h2 className='text-card-foreground'>SKU: {sku}</h2>
            <h2 className='text-card-foreground'>Quantity: {quantity}</h2>
        </div>
        <div className='flex gap-1'>
            <Button className='bg-green-500'>Add</Button>
            <Button className='bg-red-500'>Remove</Button>
        </div>
    </div>
  );
}

