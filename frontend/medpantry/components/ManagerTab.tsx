'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/TableCard";
import ManagerLog from "./ManagerLog";

export default function ManagerTab() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 shadow-sm">
        <TabsTrigger value="all">All Updates</TabsTrigger>
        <TabsTrigger value="inventory">Inventory Updates</TabsTrigger>
        <TabsTrigger value="order">Order Updates</TabsTrigger>
      </TabsList>

      {["all", "inventory", "order"].map((tab) => (
        <TabsContent key={tab} value={tab}>
          <Card className="border-gray-200 shadow-md rounded-xl w-full flex flex-col items-center">
            <CardHeader className="flex flex-row items-center justify-between bg-white w-full p-6">
              <CardTitle className="text-gray-800 flex items-center flex-wrap">
                {tab === "inventory" && "Inventory Updates"}
                {tab === "order" && "Order Updates"}
                {tab === "all" && "All Updates"}
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full p-6 bg-white text-gray-500">
              {tab === "inventory" && (
                <div>
                  <p>Inventory updates</p>
                </div>
              )}
              {tab === "order" && (
                <div>
                  <p>Order updates</p>
                </div>
              )}
              {tab === "all" && (
                <div>
                  <p>All updates.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
