import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    
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
    
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Ride History</h2>
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
                        {transactions.map((transaction) => (
                            <tr key={transaction.TransactionId} className="border-b">
                                <td className="px-4 py-2">{transaction.CustomerName}</td>
                                <td className="px-4 py-2">
                                    {transaction.DriverFirstName} {transaction.DriverLastName}
                                </td>
                                <td className="px-4 py-2">{transaction.PickupLocation}</td>
                                <td className="px-4 py-2">{transaction.Destination}</td>
                                <td className="px-4 py-2">
                                    {new Date(transaction.Date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                        {transaction.Status}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    {transaction.CompletedAt 
                                        ? new Date(transaction.CompletedAt).toLocaleString() 
                                        : '—'}
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