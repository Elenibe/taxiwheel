import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash } from 'lucide-react';

function DriversPage() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [modalMode, setModalMode] = useState('add');

    const [driverForm, setDriverForm] = useState({
        firstName: '', lastName: '', phoneNo: '',
        carModel: '', vehicleColor: '', licenseNo: '', plateNo: ''
    });

    useEffect(() => { fetchDrivers(); }, []);

    const fetchDrivers = () => {
        fetch('https://taxiwheel-backend.onrender.com/drivers')
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.log(err));
    };

    // ✅ Filter by name, phone, or license
    const filtered = data.filter(driver => {
        const q = search.toLowerCase();
        return (
            (driver.Firstname && driver.Firstname.toLowerCase().includes(q)) ||
            (driver.Lastname && driver.Lastname.toLowerCase().includes(q)) ||
            (driver.PhoneNo && driver.PhoneNo.toLowerCase().includes(q)) ||
            (driver.LicenseNo && driver.LicenseNo.toLowerCase().includes(q))
        );
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDriverForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddDriver = () => {
        fetch('https://taxiwheel-backend.onrender.com/add-driver', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driverForm)
        })
        .then(res => res.json())
        .then(() => { alert('Driver added successfully'); fetchDrivers(); setShowModal(false); resetForm(); })
        .catch(() => alert('Failed to add driver'));
    };

    const handleEditDriver = () => {
        fetch(`https://taxiwheel-backend.onrender.com/drivers/${selectedDriver.Driverid}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driverForm)
        })
        .then(res => res.json())
        .then(() => { alert('Driver updated successfully'); fetchDrivers(); setShowModal(false); resetForm(); })
        .catch(() => alert('Failed to update driver'));
    };

    const handleDeleteDriver = (driverId) => {
        if (window.confirm('Are you sure you want to delete this driver?')) {
            fetch(`https://taxiwheel-backend.onrender.com/drivers/${driverId}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => { alert('Driver deleted successfully'); fetchDrivers(); })
            .catch(() => alert('Failed to delete driver'));
        }
    };

    const resetForm = () => {
        setDriverForm({ firstName: '', lastName: '', phoneNo: '', carModel: '', vehicleColor: '', licenseNo: '', plateNo: '' });
        setSelectedDriver(null);
    };

    const openAddModal = () => { setModalMode('add'); setShowModal(true); resetForm(); };

    const openEditModal = (driver) => {
        setModalMode('edit');
        setSelectedDriver(driver);
        setDriverForm({
            firstName: driver.Firstname, lastName: driver.Lastname, phoneNo: driver.PhoneNo,
            carModel: driver.CarModel, vehicleColor: driver.VehicleColor,
            licenseNo: driver.LicenseNo, plateNo: driver.PlateNo
        });
        setShowModal(true);
    };

    const handleViewDriver = (driver) => {
        alert(`Driver Details:\nName: ${driver.Firstname} ${driver.Lastname}\nPhone: ${driver.PhoneNo}\nCar Model: ${driver.CarModel}\nLicense No: ${driver.LicenseNo}`);
    };

    return (
        <div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">{modalMode === 'add' ? 'Add New Driver' : 'Edit Driver'}</h2>
                        <div className="space-y-4">
                            {[['firstName','First Name'],['lastName','Last Name'],['phoneNo','Phone Number'],['carModel','Car Model'],['vehicleColor','Vehicle Color'],['licenseNo','License Number'],['plateNo','Plate Number']].map(([name, placeholder]) => (
                                <input key={name} type="text" name={name} placeholder={placeholder}
                                    value={driverForm[name]} onChange={handleInputChange}
                                    className="w-full p-2 border rounded" />
                            ))}
                            <div className="flex justify-between">
                                <button onClick={() => setShowModal(false)} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
                                <button onClick={modalMode === 'add' ? handleAddDriver : handleEditDriver} className="bg-yellow-400 text-white px-4 py-2 rounded">
                                    {modalMode === 'add' ? 'Add' : 'Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Drivers</h2>
                <button onClick={openAddModal} className="bg-yellow-400 text-white px-4 py-2 rounded">Add Driver</button>
            </div>

            {/* ✅ Search bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name, phone, or license..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
            </div>

            <div className="bg-white rounded-lg shadow">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-4">DriverID</th>
                            <th className="text-left p-4">First Name</th>
                            <th className="text-left p-4">Last Name</th>
                            <th className="text-left p-4">Phone No</th>
                            <th className="text-left p-4">Car Model</th>
                            <th className="text-left p-4">Vehicle Color</th>
                            <th className="text-left p-4">License No</th>
                            <th className="text-left p-4">Plate No</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan="9" className="p-4 text-center text-gray-500">No drivers found</td></tr>
                        ) : filtered.map((driver) => (
                            <tr key={driver.Driverid} className="border-b">
                                <td className="p-4">{driver.Driverid}</td>
                                <td className="p-4">{driver.Firstname}</td>
                                <td className="p-4">{driver.Lastname}</td>
                                <td className="p-4">{driver.PhoneNo}</td>
                                <td className="p-4">{driver.CarModel}</td>
                                <td className="p-4">{driver.VehicleColor}</td>
                                <td className="p-4">{driver.LicenseNo}</td>
                                <td className="p-4">{driver.PlateNo}</td>
                                <td className="p-4 flex gap-2">
                                    <Eye onClick={() => handleViewDriver(driver)} className="w-5 h-5 text-blue-500 cursor-pointer" />
                                    <Edit onClick={() => openEditModal(driver)} className="w-5 h-5 text-yellow-500 cursor-pointer" />
                                    <Trash onClick={() => handleDeleteDriver(driver.Driverid)} className="w-5 h-5 text-red-500 cursor-pointer" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DriversPage;