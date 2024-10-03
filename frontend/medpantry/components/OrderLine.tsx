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
  quantity: string;
  boxNumber: string;
}

export default function OrderLine({ itemName, quantity, boxNumber }: OrderLineProps) {
  return (
    <div>
        <TableRow className="border-gray-100 hover:bg-gray-50">
          <TableCell className="text-gray-600">
            <span className="flex items-center">
              {order.itemName}
            </span>
          </TableCell>
          <TableCell className="text-gray-600 text-center">
            <span className="flex items-center">
              {order.quantity}
            </span>
          </TableCell>
          <TableCell className="text-gray-600">
            <span className="flex items-center">
              Box #{order.sku}
            </span>
          </TableCell>
        </TableRow>
    </div>
  );
}

