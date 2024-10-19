import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/TableCard";
import ManagerLog from "./ManagerLog";
import Order from "@/components/Order";


export default function ManagerTab() {
    const hardcodedData = [
      {
        quantity: 1,
        sku: "150",
        itemName: "Adult Oxygen Mask (No Tubing) - Box Of 30",
      },
    ];

    const HardCodedBoxes = [[7]];
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
                  <ManagerLog />
                </div>
              )}
              {tab === "order" && (
                <div>
                  <Order
                    key={1}
                    orderNumber={"#1001"}
                    datas={hardcodedData}
                    boxes={HardCodedBoxes}
                    displayTakeOrderButton={false}
                  />
                </div>
              )}
              {tab === "all" && (
                <div>
                  <ManagerLog />
                  <Order
                    key={1}
                    orderNumber={"#1001"}
                    datas={hardcodedData}
                    boxes={HardCodedBoxes}
                    displayTakeOrderButton={false}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
