import React, { useState } from 'react';
import HomePage from './Home.jsx';
import LoginPage from './LoginPage.jsx';
import AdminLayout from './AdminLayout';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminData, setAdminData] = useState(null);

    const handleLogin = (adminInfo) => {
        setIsLoggedIn(true);
        setAdminData(adminInfo);
        setCurrentPage('admin');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setAdminData(null);
        setCurrentPage('home');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage onNavigate={setCurrentPage} />;
            case 'login':
                return <LoginPage onLogin={handleLogin} />;
            case 'admin':
                return isLoggedIn ? (
                    <AdminLayout 
                        onLogout={handleLogout} 
                        onNavigate={setCurrentPage} 
                        adminData={adminData} 
                    />
                ) : (
                    <LoginPage onLogin={handleLogin} />
                );
            default:
                return <HomePage onNavigate={setCurrentPage} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {renderPage()}
        </div>
    );
}

export default App;
