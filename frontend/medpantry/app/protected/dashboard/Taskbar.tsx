import React from "react";
import Link from "next/link";

const Taskbar: React.FC = () => {
  return (
    <div className="taskbar">
      <ul>
        <li>
          <Link href="/orders">
            <button>Current Orders</button>
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
