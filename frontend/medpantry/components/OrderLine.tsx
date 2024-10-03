import React from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/TableCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Package } from "lucide-react";

interface OrderLineProps {
	itemName: string;
	quantity: number;
	boxNumbers: number[]; // Expecting an array of numbers for box numbers
}

export default function OrderLine({ itemName, quantity, boxNumbers }: OrderLineProps) {
	// Validate boxNumbers to ensure it's an array of numbers
	const isBoxNumbersValid = (numbers: any): numbers is number[] => {
		return Array.isArray(numbers) && numbers.every(num => typeof num === 'number');
	};
  return (
    <div>
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
              Box #{boxNumbers}
            </span>
          </TableCell>
        </TableRow>
    </div>
  );
}

