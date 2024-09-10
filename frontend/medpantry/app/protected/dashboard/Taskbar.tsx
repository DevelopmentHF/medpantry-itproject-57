import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const Taskbar: React.FC = () => {
  return (
    <div className="taskbar">
      <ul className="flex gap-4 items-center">
        <li>
          <Link href="/orders">
            <Button className="">Current Orders</Button>
          </Link>
        </li>
        <li>
          <Link href="/inventory">
            <button>Inventory</button>
          </Link>
        </li>
        <li>
          <Link href="/updates">
            <button>Updates</button>
          </Link>
        </li>
        <li>
          <Link href="/people">
            <button>People</button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Taskbar;
