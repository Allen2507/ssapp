// Import required modules
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.options('*', cors()); // Enable CORS for preflight requests
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 3001;

// MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
});

// Test the database connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database.');
        connection.release();
    } catch (err) {
        console.error('Error connecting to MySQL:', err);
    }
})();

// Function to create tables if not exist
const createTablesIfNotExist = async () => {
    const createChildrenProfilesTable = `
    CREATE TABLE IF NOT EXISTS children_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        dob DATE,
        age INT,
        gender VARCHAR(10),
        religion VARCHAR(50),
        denomination VARCHAR(50),
        baptism_date DATE,
        holy_spirit_date DATE,
        doa DATE,
        standard VARCHAR(10),
        medium VARCHAR(10),
        admission_number VARCHAR(50),
        location VARCHAR(100),
        address TEXT,
        student_mobile_1 VARCHAR(15),
        student_mobile_2 VARCHAR(15),
        father_name VARCHAR(100),
        father_religion VARCHAR(50),
        father_denomination VARCHAR(50),
        father_baptism_date DATE,
        father_holy_spirit_date DATE,
        father_mobile VARCHAR(15),
        mother_name VARCHAR(100),
        mother_religion VARCHAR(50),
        mother_denomination VARCHAR(50),
        mother_baptism_date DATE,
        mother_holy_spirit_date DATE,
        mother_mobile VARCHAR(15)
    )`;

    const createAttendanceTable = `
    CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        attendance_date DATE,
        status VARCHAR(20),
        FOREIGN KEY (student_id) REFERENCES children_profiles(id)
    )`;

    const createTeacherProfilesTable = `
    CREATE TABLE IF NOT EXISTS teacher_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        age INT,
        address TEXT,
        mobile_1 VARCHAR(15),
        mobile_2 VARCHAR(15),
        baptism_date DATE,
        holy_spirit_date DATE
    )`;

    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        password VARCHAR(255)
    )`;

    try {
        const connection = await pool.getConnection();
        await connection.query(createChildrenProfilesTable);
        await connection.query(createAttendanceTable);
        await connection.query(createTeacherProfilesTable);
        await connection.query(createUsersTable);
        console.log('Tables are ready.');
        connection.release();
    } catch (err) {
        console.error('Error creating tables:', err);
    }
};
createTablesIfNotExist();

// Function to calculate age from DOB
const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Example Endpoint: Add a child profile
app.post('/children_profile_form', async (req, res) => {
    const {
        name, dob, gender, religion, denomination, baptism_date, holy_spirit_date,
        doa, standard, medium, admission_number, location, address, student_mobile_1, student_mobile_2,
        father_name, father_religion, father_denomination, father_baptism_date, father_holy_spirit_date, father_mobile,
        mother_name, mother_religion, mother_denomination, mother_baptism_date, mother_holy_spirit_date, mother_mobile
    } = req.body;

    const age = calculateAge(dob);

    const query = `
    INSERT INTO children_profiles (
        name, dob, age, gender, religion, denomination, baptism_date, holy_spirit_date,
        doa, standard, medium, admission_number, location, address, student_mobile_1, student_mobile_2,
        father_name, father_religion, father_denomination, father_baptism_date, father_holy_spirit_date, father_mobile,
        mother_name, mother_religion, mother_denomination, mother_baptism_date, mother_holy_spirit_date, mother_mobile
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query(query, [
            name, dob, age, gender, religion, denomination, baptism_date, holy_spirit_date,
            doa, standard, medium, admission_number, location, address, student_mobile_1, student_mobile_2,
            father_name, father_religion, father_denomination, father_baptism_date, father_holy_spirit_date, father_mobile,
            mother_name, mother_religion, mother_denomination, mother_baptism_date, mother_holy_spirit_date, mother_mobile
        ]);
        connection.release();
        console.log(`[${new Date().toLocaleTimeString()}] Data saved to the database`);
        res.json({ data: result, message: 'Child profile created successfully' });
    } catch (err) {
        console.error('MySQL error:', err);
        res.status(400).json({ error: err.message });
    }
});

// Register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    try {
        // Check if the username already exists
        const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert the new user into the database
        const [result] = await pool.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    try {
        // Check if the user exists
        const [rows] = await pool.query('SELECT id, password FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const user = rows[0];
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'Login successful', userId: user.id });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/children_profiles', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id,name,standard,admission_number,medium FROM children_profiles');
        res.json({ data: rows });
    } catch (err) {
        console.error('MySQL error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/child_profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM children_profiles WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Child profile not found' });
        }
        res.json({ data: rows[0] });
    } catch (err) {
        console.error('MySQL error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/teacher_profiles' , async (req, res) => {
    const { name, age, address, mobile_1, mobile_2, baptism_date, holy_spirit_date } = req.body;
    const query = `INSERT INTO teacher_profiles (name, age, address, mobile_1, mobile_2, baptism_date, holy_spirit_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query(query, [name, age, address, mobile_1, mobile_2, baptism_date, holy_spirit_date]);
        connection.release();
        res.json({ data: result, message: 'Teacher profile created successfully' });
    } catch (err) {
        console.error('MySQL error:', err);
        res.status(400).json({ error: err.message });
    }
});

app.get('/teacher_profile_view', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM teacher_profiles');
        res.json({ data: rows });
    } catch (err) {
        console.error('MySQL error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
