import React, {useState} from "react";
import DashboardPage from "./DashboardPage.jsx";
import DriversPage from "./DriversPage.jsx";
import CustomersPage from "./CustomersPage.jsx";
import TransactionsPage from "./TransactionPage.jsx";
import AdminsPage from "./AdminsPage.jsx";


function AdminLayout({ onLogout }) {
  const [currentSection, setCurrentSection] = useState('dashboard');
  
  const sections = {
    dashboard: <DashboardPage />,
    admins: <AdminsPage/>,
    drivers: <DriversPage />,
    customers: <CustomersPage />,
    transactions: <TransactionsPage />
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">TAXIWHEEL</h1>
        </div>
        <nav className="mt-8">
          {Object.keys(sections).map(section => (
            <button
              key={section}
              onClick={() => setCurrentSection(section)}
              className={`w-full text-left p-4 hover:bg-gray-800 ${
                currentSection === section ? 'bg-gray-800' : ''
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
          <button
            onClick={onLogout}
            className="w-full text-left p-4 hover:bg-gray-800 text-red-400"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {sections[currentSection]}
      </main>
    </div>
  );
}
export default AdminLayout