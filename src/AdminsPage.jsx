import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash } from 'lucide-react';

function AdminsPage() {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [modalMode, setModalMode] = useState('add');

    const [adminForm, setAdminForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNo: ''    
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = () => {
        fetch('https://taxiwheel-backend.onrender.com/admins')
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.log(err));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddAdmin = () => {
        fetch('https://taxiwheel-backend.onrender.com/add-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminForm)
        })
        .then(res => res.json())
        .then(result => {
            alert('Admin added successfully');
            fetchAdmins();
            setShowModal(false);
            resetForm();
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Failed to add admin');
        });
    };

    const handleEditAdmin = () => {
        fetch(`https://taxiwheel-backend.onrender.com/admins/${selectedAdmin.Adminid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminForm)
        })
        .then(res => res.json())
        .then(result => {
            alert('Admin updated successfully');
            fetchAdmins();
            setShowModal(false);
            resetForm();
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Failed to update admin');
        });
    };

    const handleDeleteAdmin = (adminId) => {
        if(window.confirm('Are you sure you want to delete this admin?')) {
            fetch(`https://taxiwheel-backend.onrender.com/admins/${adminId}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(result => {
                alert('Admin deleted successfully');
                fetchAdmins();
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Failed to delete admin');
            });
        }
    };

    const resetForm = () => {
        setAdminForm({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNo: ''
        });
        setSelectedAdmin(null);
    };

    const openAddModal = () => {
        setModalMode('add');
        setShowModal(true);
        resetForm();
    };

    const openEditModal = (admin) => {
        setModalMode('edit');
        setSelectedAdmin(admin);
        setAdminForm({
            firstName: admin.Firstname,
            lastName: admin.Lastname,
            email: admin.Email,
            password: admin.Password,
            phoneNo: admin.PhoneNo
        });
        setShowModal(true);
    };

    const handleViewAdmin = (admin) => {
        alert(`Admin Details:
Name: ${admin.Firstname} ${admin.Lastname}
Email: ${admin.Email}
Password: ${admin.Password}
Phone: ${admin.PhoneNo}`);
    };

    return (
        <div>
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">
                            {modalMode === 'add' ? 'Add New Admin' : 'Edit Admin'}
                        </h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={adminForm.firstName}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={adminForm.lastName}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={adminForm.email}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="password"
                                placeholder="Password"
                                value={adminForm.password}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="phoneNo"
                                placeholder="Phone Number"
                                value={adminForm.phoneNo}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        
                            <div className="flex justify-between">
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 text-black px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={modalMode === 'add' ? handleAddAdmin : handleEditAdmin}
                                    className="bg-yellow-400 text-white px-4 py-2 rounded"
                                >
                                    {modalMode === 'add' ? 'Add' : 'Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Admins Section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Adminstration</h2>
                <button 
                    onClick={openAddModal} 
                    className="bg-yellow-400 text-white px-4 py-2 rounded"
                >
                    Add Admin
                </button>
            </div>
            
            {/* Admins Table */}
            <div className="bg-white rounded-lg shadow">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-4">AdminID</th>
                            <th className="text-left p-4">First Name</th>
                            <th className="text-left p-4">Last Name</th>
                            <th className="text-left p-4">Email</th>
                            <th className="text-left p-4">Password</th>
                            <th className="text-left p-4">Phone No</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((admin) => (
                            <tr key={admin.Adminid} className="border-b">
                                <td className="p-4">{admin.Adminid}</td>
                                <td className="p-4">{admin.Firstname}</td>
                                <td className="p-4">{admin.Lastname}</td>
                                <td className="p-4">{admin.Email}</td>
                                <td className="p-4">{admin.Password}</td>
                                <td className="p-4">{admin.PhoneNo}</td>
                                <td className="p-4 flex gap-2">
                                    <Eye 
                                        onClick={() => handleViewAdmin(admin)}
                                        className="w-5 h-5 text-blue-500 cursor-pointer" 
                                    />
                                    <Edit 
                                        onClick={() => openEditModal(admin)}
                                        className="w-5 h-5 text-yellow-500 cursor-pointer" 
                                    />
                                    <Trash 
                                        onClick={() => handleDeleteAdmin(admin.Adminid)}
                                        className="w-5 h-5 text-red-500 cursor-pointer" 
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminsPage;
