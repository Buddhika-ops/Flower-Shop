import React from 'react';
import {
  Home as HomeIcon,
  ShoppingBag,
  Edit2,
  ClipboardList,
  Users,
  BarChart2,
  Settings as SettingsIcon,
  Mail,
  HelpCircle,
} from 'lucide-react';

import SidebarButtons from './SidebarButtons';
import SidebarTopics from './SidebarTopics';

function Sidebar({ sidebarClick }) {
  return (
    <div>
      <div className="fixed flex flex-col w-1/4 h-screen bg-gray-100 top-18">
        <SidebarTopics topic="Main Menu" />
        <SidebarButtons
          label="Home"
          icon={<HomeIcon className="w-5 h-5" />}
          onClick={() => sidebarClick('Home')}
        />
        <SidebarButtons
          label="Add New Product"
          icon={<ShoppingBag className="w-5 h-5" />}
          onClick={() => sidebarClick('add_item')}
        />

        <SidebarButtons
          label="Update Items"
          icon={<Edit2 className="w-5 h-5" />}
          onClick={() => sidebarClick('manage_items')}
        />
        <SidebarButtons
          label="Orders"
          icon={<ClipboardList className="w-5 h-5" />}
          onClick={() => sidebarClick('order')}
        />
        <SidebarButtons
          label="Customers"
          icon={<Users className="w-5 h-5" />}
          onClick={() => sidebarClick('customer')}
        />
        <SidebarButtons
          label="Analytics Report"
          icon={<BarChart2 className="w-5 h-5" />}
          onClick={() => sidebarClick('order')}
        />
        <SidebarTopics topic="Other" />
        <SidebarButtons
          label="Settings"
          icon={<SettingsIcon className="w-5 h-5" />}
          onClick={() => sidebarClick('order')}
        />
        <SidebarButtons
          label="Inbox"
          icon={<Mail className="w-5 h-5" />}
          onClick={() => sidebarClick('order')}
        />
        <SidebarButtons
          label="Help & support"
          icon={<HelpCircle className="w-5 h-5" />}
          onClick={() => sidebarClick('order')}
        />
      </div>
    </div>
  );
}

export default Sidebar;
