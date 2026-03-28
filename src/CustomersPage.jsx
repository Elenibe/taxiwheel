function CustomersPage() {
    const customers = [
      { id: 1, name: 'Emily Horvath', email: 'emily@example.com', phone: '+44 21 7844 3489' },
      { id: 2, name: 'Alexis Francis', email: 'alexis@example.com', phone: '+44 21 7544 3480' }
    ];
  
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Customers</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by name, email or phone"
              className="p-2 border rounded w-64"
            />
            <button className="bg-yellow-400 text-white px-4 py-2 rounded">
              Search
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Customer ID</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone Number</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} className="border-b">
                <td className="p-4">{customer.id}</td>
                <td className="p-4">{customer.name}</td>
                <td className="p-4">{customer.email}</td>
                <td className="p-4">{customer.phone}</td>
                <td className="p-4">
                  <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                    Activate
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

export default CustomersPage