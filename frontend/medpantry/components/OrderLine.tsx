import React from 'react';
import {
  TableCell,
  TableRow,
} from "@/components/Table";

interface OrderLineProps {
	itemName: string;
	quantity: number;
	boxNumbers: number[]; 
}

export default function OrderLine({ itemName, quantity, boxNumbers }: OrderLineProps) {
	// Validate boxNumbers to ensure it's an array of numbers
	const isBoxNumbersValid = (numbers: any): numbers is number[] => {
		return Array.isArray(numbers) && numbers.every(num => typeof num === 'number');
	};
  return (
    <TableRow className="border-gray-100 hover:bg-gray-50">
      <TableCell className="text-gray-600">
        <span className="flex items-center">
          {itemName}
        </span>
      </TableCell>
      <TableCell className="text-gray-600 text-center">
        <span className="flex items-center">
          {quantity}
        </span>
      </TableCell>
      <TableCell className="text-gray-600">
        <span className="flex items-center">
          {isBoxNumbersValid(boxNumbers) && boxNumbers.length > 0
            ? `#${boxNumbers.join(', ')}`
            : 'N/A'}
        </span>
      </TableCell>
    </TableRow>
  );
}

