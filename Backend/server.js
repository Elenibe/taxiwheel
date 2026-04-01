const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8081;

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  return res.json("From Backend Side");
});

// ─── DRIVERS ────────────────────────────────────────────────────────────────

app.get('/drivers', (req, res) => {
  const sql = "SELECT * FROM drivers";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Get available drivers
app.get('/drivers/available', (req, res) => {
  const sql = `
    SELECT * FROM drivers 
    WHERE (Status = 'Available' OR Status IS NULL) 
    AND Driverid NOT IN (
      SELECT DriverId FROM bookinglist 
      WHERE DriverId IS NOT NULL AND Status = 'Assigned'
    )`;
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching available drivers:', err);
      return res.status(500).json({ error: 'Failed to fetch available drivers' });
    }
    return res.json(data);
  });
});

// Add a driver
app.post('/add-driver', (req, res) => {
  const { firstName, lastName, phoneNo, carModel, vehicleColor, licenseNo, plateNo } = req.body;
  const sql = `INSERT INTO drivers (Firstname, Lastname, PhoneNo, CarModel, VehicleColor, LicenseNo, PlateNo) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [firstName, lastName, phoneNo, carModel, vehicleColor, licenseNo, plateNo];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding driver:', err);
      return res.status(500).json({ error: 'Failed to add driver' });
    }
    return res.status(201).json({ message: 'Driver added successfully', driverId: result.insertId });
  });
});

// Update full driver info (from DriversPage)
app.put('/drivers/:id', (req, res) => {
  const driverId = req.params.id;
  const { firstName, lastName, phoneNo, carModel, vehicleColor, licenseNo, plateNo } = req.body;
  const sql = `UPDATE drivers SET Firstname=?, Lastname=?, PhoneNo=?, CarModel=?, VehicleColor=?, LicenseNo=?, PlateNo=? WHERE Driverid=?`;
  const values = [firstName, lastName, phoneNo, carModel, vehicleColor, licenseNo, plateNo, driverId];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating driver:', err);
      return res.status(500).json({ error: 'Failed to update driver' });
    }
    return res.status(200).json({ message: 'Driver updated successfully' });
  });
});

// ✅ FIX: Separate endpoint just for status update (from DashboardPage)
app.patch('/drivers/:id/status', (req, res) => {
  const driverId = req.params.id;
  const { Status } = req.body;
  const sql = "UPDATE drivers SET Status = ? WHERE Driverid = ?";
  db.query(sql, [Status, driverId], (err, result) => {
    if (err) {
      console.error('Error updating driver status:', err);
      return res.status(500).json({ error: 'Failed to update driver status' });
    }
    return res.status(200).json({ message: 'Driver status updated successfully' });
  });
});

// Delete a driver
app.delete('/drivers/:id', (req, res) => {
  const driverId = req.params.id;
  const checkBookingsSql = "SELECT COUNT(*) as count FROM bookinglist WHERE DriverId = ?";
  db.query(checkBookingsSql, [driverId], (err, result) => {
    if (err) {
      console.error('Error checking bookings:', err);
      return res.status(500).json({ error: 'Failed to check driver bookings' });
    }
    if (result[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete driver with active bookings.' });
    }
    const deleteDriverSql = "DELETE FROM drivers WHERE Driverid = ?";
    db.query(deleteDriverSql, [driverId], (err, result) => {
      if (err) {
        console.error('Error deleting driver:', err);
        return res.status(500).json({ error: 'Failed to delete driver' });
      }
      return res.status(200).json({ message: 'Driver deleted successfully' });
    });
  });
});

// ─── ADMINS ─────────────────────────────────────────────────────────────────

app.get('/admins', (req, res) => {
  const sql = "SELECT * FROM admins";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post('/add-admin', (req, res) => {
  const { firstName, lastName, email, password, phoneNo } = req.body;
  const sql = `INSERT INTO admins (Firstname, Lastname, Email, Password, PhoneNo) VALUES (?, ?, ?, ?, ?)`;
  const values = [firstName, lastName, email, password, phoneNo];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding admin:', err);
      return res.status(500).json({ error: 'Failed to add admin' });
    }
    return res.status(201).json({ message: 'Admin added successfully', adminId: result.insertId });
  });
});

app.delete('/admins/:id', (req, res) => {
  const adminId = req.params.id;
  const sql = "DELETE FROM admins WHERE Adminid = ?";
  db.query(sql, [adminId], (err, result) => {
    if (err) {
      console.error('Error deleting admin:', err);
      return res.status(500).json({ error: 'Failed to delete admin' });
    }
    return res.status(200).json({ message: 'Admin deleted successfully' });
  });
});

app.put('/admins/:id', (req, res) => {
  const adminId = req.params.id;
  const { firstName, lastName, email, password, phoneNo } = req.body;
  const sql = `UPDATE admins SET Firstname=?, Lastname=?, Email=?, Password=?, PhoneNo=? WHERE Adminid=?`;
  const values = [firstName, lastName, email, password, phoneNo, adminId];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating admin:', err);
      return res.status(500).json({ error: 'Failed to update admin' });
    }
    return res.status(200).json({ message: 'Admin updated successfully' });
  });
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const sql = "SELECT * FROM admins WHERE Email = ? AND BINARY Password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Server error during login' });
    }
    if (results.length > 0) {
      return res.status(200).json({
        message: 'Login successful',
        admin: {
          id: results[0].Adminid,
          firstName: results[0].Firstname,
          lastName: results[0].Lastname,
          email: results[0].Email
        }
      });
    } else {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  });
});

// ─── BOOKINGS ────────────────────────────────────────────────────────────────

app.get('/bookings', (req, res) => {
  const sql = "SELECT * FROM bookinglist";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post('/bookings', (req, res) => {
  const { Name, Email, PickupLocation, PickupTime, Destination, Date } = req.body;
  if (!Name || !Email || !PickupLocation || !PickupTime || !Destination || !Date) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const sql = `INSERT INTO bookinglist (Name, Email, PickupLocation, PickupTime, Destination, Date, Status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [Name, Email, PickupLocation, PickupTime, Destination, Date, 'Pending'];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error creating booking:', err);
      return res.status(500).json({ error: 'Failed to create booking' });
    }
    return res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertId });
  });
});

// ✅ FIX: Only one definition of this route (duplicate removed)
app.post('/bookings/:id/assign', (req, res) => {
  const bookingId = req.params.id;
  const { driverId } = req.body;
  const sql = `UPDATE bookinglist SET DriverId=?, Status='Assigned' WHERE Bookingid=?`;
  db.query(sql, [driverId, bookingId], (err, result) => {
    if (err) {
      console.error('Error assigning driver:', err);
      return res.status(500).json({ error: 'Failed to assign driver' });
    }
    return res.status(200).json({ message: 'Driver assigned successfully' });
  });
});

// ─── TRANSACTIONS ────────────────────────────────────────────────────────────

app.get('/transactions', (req, res) => {
  const sql = `
    SELECT t.*, d.Firstname as DriverFirstName, d.Lastname as DriverLastName 
    FROM transactions t 
    LEFT JOIN drivers d ON t.DriverId = d.Driverid`;
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }
    return res.json(data);
  });
});

app.post('/complete-ride/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;

  // ✅ Simple SELECT — no JOIN confusion
  db.query("SELECT * FROM bookinglist WHERE Bookingid = ?", [bookingId], (err, bookings) => {
    if (err || bookings.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookings[0];
    const driverId = booking.DriverId;

    // ✅ INSERT IGNORE: skips silently if record already exists (stuck bookings)
    const insertSql = `
      INSERT IGNORE INTO transactions 
      (BookingId, CustomerName, CustomerEmail, PickupLocation, PickupTime, Destination, Date, DriverId, Status, CompletedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Completed', NOW())`;

    db.query(insertSql, [
      booking.Bookingid, booking.Name, booking.Email,
      booking.PickupLocation, booking.PickupTime,
      booking.Destination, booking.Date, driverId
    ], () => {
      // ✅ Always runs — free the driver regardless of insert result
      if (driverId) {
        db.query("UPDATE drivers SET Status='Available' WHERE Driverid=?", [driverId], (err) => {
          if (err) console.error('Error freeing driver:', err);
        });
      }

      // ✅ Always runs — delete the booking regardless of insert result
      db.query("DELETE FROM bookinglist WHERE Bookingid=?", [bookingId], (deleteErr) => {
        if (deleteErr) {
          console.error('Error deleting booking:', deleteErr);
          return res.status(500).json({ error: 'Failed to remove booking' });
        }
        return res.status(200).json({ message: 'Ride completed successfully' });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});