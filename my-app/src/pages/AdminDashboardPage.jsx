import React from 'react'
import { useState } from 'react';
import Sidebar from '../components/MainContent/SideBarComponent/Sidebar';
import InsertForm from '../components/MainContent/AdminOptions/Insert/InsertForm';
import ProductList from '../components/MainContent/AdminOptions/manageProducts/ProductList';
import CustomersList from'../components/MainContent/AdminOptions/customers/CustomersList'
import CompletedOrders from '../components/MainContent/AdminOptions/orders/CompletedOrders'
import PendingList from '../components/MainContent/AdminOptions/orders/PendingList';
import AnalyticsReport from '../components/MainContent/AdminOptions/analyticsReport/AnalyticsReport';
import Navbar from '../components/Navbar';
import AdminDashboard from '../components/MainContent/AdminOptions/Dashbord/AdminDashboard';
function AdminDashboardPage() {
    const [activeContent, setActiveContent] = useState('Home');

  const sidebarClick = (type) => {
    setActiveContent(type);
  };
  return (
     <div>
    <Navbar/>
      <div className="bg-white min-h-screen grid grid-cols-4 grid-rows-[6rem_1fr] ">
         
        <Sidebar sidebarClick={sidebarClick} />

        <div className="grid grid-cols-2 col-span-3 gap-4 mt-2 ">
          
           {activeContent === 'Home' && <AdminDashboard/>}
          {activeContent === 'add_item' && <InsertForm />}
          {activeContent === 'manage_items' && <ProductList/>}
          {activeContent === 'order' && <PendingList/>}
          {activeContent === 'customer' && <CustomersList/>}
          {activeContent === 'completed' && <CompletedOrders/>}
          {activeContent === 'analytics' && <AnalyticsReport/>}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
