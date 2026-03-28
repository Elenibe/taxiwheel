import React, { useState } from "react";
import axios from 'axios';
import Footer from './Footer.jsx';
import carImage from './assets/carImage.jpg'; 
import car3 from './assets/car3.jpg';


const SuccessModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={onClose}>
          &times;
        </button>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-xl font-bold ml-4">Success</h2>
        </div>
        <p>Check your email for a booking confirmation. We'll see you soon!</p>
        <button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

function HomePage({ onNavigate }) {
  const [booking, setBooking] = useState({
    Name: '',
    Email: '',
    PickupLocation: '',
    PickupTime: '',
    Destination: '',
    Date: ''
  });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false); // New state variable

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/bookings', booking);
      setShowSuccessModal(true); 
      setBooking({
        Name: '',
        Email: '',
        PickupLocation: '',
        PickupTime: '',
        Destination: '',
        Date: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('There was an error with your booking. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <nav className="bg-white shadow-lg" style={{ backgroundColor: '#f9db00' }}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {/* Logo and Brand */}
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-yellow-400 text-xl font-bold">TW</span>
              </div>
              <button onClick={() => onNavigate('home')} className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                TAXIWHEEL
              </button>
            </div>
            <button 
              onClick={() => onNavigate('login')} 
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 shadow-md"
            >
              Sign In
            </button>
          </div>
        </nav>

        <div style={{ backgroundColor: '#f9db00' }}>
          <div className="max-w-7xl mx-auto px-4 py-16 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left side - Taxi Image */}
              <div className="flex justify-center">
                <img src={carImage} alt="Classic Black Taxi" className="max-w-full h-auto mt-8 md:mt-0" />
              </div>

              {/* Right side - Let's Go Content */}
              <div className="text-black">
                <p className="text-lg mb-3">Reach your <span className="font-bold">Destinations</span></p>
                <div className="flex items-center space-x-4">
  <h1 className="text-7xl font-bold">LET'S</h1>
  <div className="relative w-40 h-40 rounded-full flex items-center justify-center"> {/* Increased size and rounded-full */}
    <div className="absolute inset-0 rounded-full bg-black"></div>
    <span className="relative text-yellow-400 text-8xl font-bold z-10">GO</span>
  </div>
</div>
                <button className="bg-black text-3xl text-white font-bold py-5 px-8 rounded-lg hover:bg-gray-800 transition-colors mt-8 mb-8">
                  Download App
                </button>
                <p className="text-lg mb-2">There are many variations of passages of Lorem Ipsum available, but the majority.</p>
              </div>
            </div>
          </div>
        </div>

{/* Booking Form Section with Image */}
<div className="max-w-7xl mx-auto p-6 bg-white">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    {/* Left side - Booking Form */}
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-semibold">Name</label>
            <input
              type="text"
              value={booking.Name}
              onChange={(e) => setBooking({ ...booking, Name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-semibold">Email</label>
            <input
              type="email"
              value={booking.Email}
              onChange={(e) => setBooking({ ...booking, Email: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-semibold">Pickup Location</label>
            <input
              type="text"
              value={booking.PickupLocation}
              onChange={(e) => setBooking({ ...booking, PickupLocation: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-semibold">Pickup Time</label>
            <input
              type="time"
              value={booking.PickupTime}
              onChange={(e) => setBooking({ ...booking, PickupTime: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-semibold">Destination</label>
            <input
              type="text"
              value={booking.Destination}
              onChange={(e) => setBooking({ ...booking, Destination: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-semibold">Date</label>
            <input
              type="date"
              value={booking.Date}
              onChange={(e) => setBooking({ ...booking, Date: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors">
            Book Now
          </button>
        </div>
      </form>
    </div>

    {/* Right side - Car Image */}
    <div className="flex justify-center items-center">
  <img src={car3} alt="Taxi Service" className="max-w-full h-auto rounded-lg md:h-[550px] md:w-[1000px]" /> {/* Added md:h-[300px] md:w-[300px] */}
</div>
  </div>
</div>

      <section className="max-w-7xl mx-auto px-4 py-16">
  <div className="text-center mb-8">
    <h2 className="text-3xl font-bold text-gray-800">Welcome To Us</h2>
    <p className="text-gray-600 mt-4">We created our taxi to help you to find the most dependable and highest quality taxi services, anytime and anywhere. All our drivers are uniformed and fully insured.</p>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">Address Pickup</h3>
      <p className="text-gray-600">We always pick up our clients on time, 24/7 availability</p>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">Airport Transfer</h3>
      <p className="text-gray-600">SetGo specialized in 24 hours airport transfer service</p>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">Long Distance</h3>
      <p className="text-gray-600">We offer you a long distance taxi service to anywhere</p>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">Taxi Tours</h3>
      <p className="text-gray-600">We offer tour taxi of various durations and complexity</p>
    </div>
  </div>
</section>
      </div>
      {showSuccessModal && <SuccessModal onClose={handleCloseModal} />} 
      <Footer />
    </div>
  );
}

export default HomePage;