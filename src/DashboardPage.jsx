import React, { useState, useEffect } from "react";
import axios from "axios";

function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ✅ FIX: fetchBookings is now a standalone function visible to all handlers
  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8081/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Error loading bookings. Please try again.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchAvailableDrivers = async () => {
    try {
      const response = await axios.get("http://localhost:8081/drivers/available");
      setAvailableDrivers(response.data);
    } catch (error) {
      console.error("Error fetching available drivers:", error);
      alert("Error loading available drivers. Please try again.");
    }
  };

  const handleAssignClick = async (booking) => {
    setSelectedBooking(booking);
    await fetchAvailableDrivers();
    setIsModalOpen(true);
  };

  const assignDriver = async (driverId) => {
    try {
      // Assign driver to booking
      await axios.post(
        `http://localhost:8081/bookings/${selectedBooking.Bookingid}/assign`,
        { driverId }
      );

      // ✅ FIX: Use separate PATCH endpoint for status update (no longer corrupts driver data)
      await axios.patch(`http://localhost:8081/drivers/${driverId}/status`, {
        Status: "Unavailable",
      });

      // ✅ FIX: fetchBookings is now in scope
      await fetchBookings();
      await fetchAvailableDrivers();

      setIsModalOpen(false);
      alert("Driver assigned successfully!");
    } catch (error) {
      console.error("Error assigning driver:", error);
      alert("Error assigning driver. Please try again.");
    }
  };

  const handleCompleteRide = async (bookingId) => {
    try {
      await axios.post(`http://localhost:8081/complete-ride/${bookingId}`);
      await fetchBookings();
      alert("Ride completed successfully!");
    } catch (error) {
      console.error("Error completing ride:", error);
      alert("Error completing ride. Please try again.");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Rides</h3>
          <p className="text-3xl font-bold">{bookings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Drivers</h3>
          <p className="text-3xl font-bold">45</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Today's Revenue</h3>
          <p className="text-3xl font-bold">$2,567</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Booking List</h2>
        <table className="w-full table-auto bg-white rounded-lg shadow-md">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 font-semibold text-left">Customer Name</th>
              <th className="px-4 py-3 font-semibold text-left">Email</th>
              <th className="px-4 py-3 font-semibold text-left">Pickup Location</th>
              <th className="px-4 py-3 font-semibold text-left">Pickup Time</th>
              <th className="px-4 py-3 font-semibold text-left">Destination</th>
              <th className="px-4 py-3 font-semibold text-left">Date</th>
              <th className="px-4 py-3 font-semibold text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.Bookingid} className="border-b">
                <td className="px-4 py-3">{booking.Name}</td>
                <td className="px-4 py-3">{booking.Email}</td>
                <td className="px-4 py-3">{booking.PickupLocation}</td>
                <td className="px-4 py-3">{booking.PickupTime}</td>
                <td className="px-4 py-3">{booking.Destination}</td>
                <td className="px-4 py-3">{booking.Date}</td>
                <td className="px-4 py-3">
                  {booking.Status === "Pending" ? (
                    <button
                      className="bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleAssignClick(booking)}
                    >
                      Assign Driver
                    </button>
                  ) : booking.Status === "Assigned" ? (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleCompleteRide(booking.Bookingid)}
                    >
                      Complete Ride
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Available Drivers</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              {availableDrivers.length > 0 ? (
                <div className="space-y-4">
                  {availableDrivers.map((driver) => (
                    <div
                      key={driver.Driverid}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => assignDriver(driver.Driverid)}
                    >
                      <h4 className="font-semibold">
                        {driver.Firstname} {driver.Lastname}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Car: {driver.CarModel} ({driver.VehicleColor})
                      </p>
                      <p className="text-sm text-gray-600">
                        License: {driver.LicenseNo}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  No available drivers at the moment
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;