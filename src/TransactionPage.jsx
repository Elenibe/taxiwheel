import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('https://taxiwheel-backend.onrender.com/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                alert("Error loading transaction history. Please try again.");
            }
        };
        fetchTransactions();
    }, []);

    const filtered = transactions.filter(t => {
        const q = search.toLowerCase();
        return (
            (t.CustomerName && t.CustomerName.toLowerCase().includes(q)) ||
            (t.DriverFirstName && t.DriverFirstName.toLowerCase().includes(q)) ||
            (t.DriverLastName && t.DriverLastName.toLowerCase().includes(q)) ||
            (t.PickupLocation && t.PickupLocation.toLowerCase().includes(q)) ||
            (t.Destination && t.Destination.toLowerCase().includes(q)) ||
            (t.CustomerEmail && t.CustomerEmail.toLowerCase().includes(q))
        );
    });

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Ride History</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by customer, driver, pickup, or destination..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left">Customer</th>
                            <th className="px-4 py-2 text-left">Driver</th>
                            <th className="px-4 py-2 text-left">Pickup Location</th>
                            <th className="px-4 py-2 text-left">Destination</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Completed At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan="7" className="p-4 text-center text-gray-500">No records found</td></tr>
                        ) : filtered.map((transaction) => (
                            <tr key={transaction.TransactionId} className="border-b">
                                <td className="px-4 py-2">{transaction.CustomerName}</td>
                                <td className="px-4 py-2">{transaction.DriverFirstName} {transaction.DriverLastName}</td>
                                <td className="px-4 py-2">{transaction.PickupLocation}</td>
                                <td className="px-4 py-2">{transaction.Destination}</td>
                                <td className="px-4 py-2">{new Date(transaction.Date).toLocaleDateString()}</td>
                                <td className="px-4 py-2">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                        {transaction.Status}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    {transaction.CompletedAt ? new Date(transaction.CompletedAt).toLocaleString() : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionsPage;