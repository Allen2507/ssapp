// Import required modules
const express = require('express');
const { Pool } = require('pg');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'https://ssdb.netlify.app',
    credentials: true,
}));
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// PostgreSQL connection pool
const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
    } else {
        console.log('Connected to PostgreSQL at:', res.rows[0].now);
    }
});

const createTablesIfNotExist = async () => {
    const createChildrenProfilesTable = `
    CREATE TABLE IF NOT EXISTS children_profiles (
        id SERIAL PRIMARY KEY,
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
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES children_profiles(id),
        attendance_date DATE,
        status VARCHAR(20)
    )`;

    const createTeacherProfilesTable = `
    CREATE TABLE IF NOT EXISTS teacher_profiles (
        id SERIAL PRIMARY KEY,
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
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        password VARCHAR(255)
    )`;

    try {
        await pool.query(createChildrenProfilesTable);
        await pool.query(createAttendanceTable);
        await pool.query(createTeacherProfilesTable);
        await pool.query(createUsersTable);
        console.log('Tables are ready');
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

// Endpoint to add a child profile with age calculation
app.post('/children_profile_form', async (req, res) => {
    const {
        name, dob, gender, religion, denomination, baptism_date, holy_spirit_date,
        doa, standard, medium, admission_number, location, address, student_mobile_1, student_mobile_2,
        father_name, father_religion, father_denomination, father_baptism_date, father_holy_spirit_date, father_mobile,
        mother_name, mother_religion, mother_denomination, mother_baptism_date, mother_holy_spirit_date, mother_mobile
    } = req.body;

    const age = calculateAge(dob);

    const query = `INSERT INTO children_profiles (
        name, dob, age, gender, religion, denomination, baptism_date, holy_spirit_date,
        doa, standard, medium, admission_number, location, address, student_mobile_1, student_mobile_2,
        father_name, father_religion, father_denomination, father_baptism_date, father_holy_spirit_date, father_mobile,
        mother_name, mother_religion, mother_denomination, mother_baptism_date, mother_holy_spirit_date, mother_mobile
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
    ) RETURNING *`;

    try {
        const result = await pool.query(query, [
            name, dob, age, gender, religion, denomination, baptism_date, holy_spirit_date,
            doa, standard, medium, admission_number, location, address, student_mobile_1, student_mobile_2,
            father_name, father_religion, father_denomination, father_baptism_date, father_holy_spirit_date, father_mobile,
            mother_name, mother_religion, mother_denomination, mother_baptism_date, mother_holy_spirit_date, mother_mobile
        ]);
        res.json({ data: result.rows[0], message: 'Child profile created successfully' });
    } catch (err) {
        console.error('PostgreSQL error:', err);
        res.status(400).json({ error: err.message });
    }
});

// Endpoint to add attendance
app.post('/attendance', async (req, res) => {
    const { student_id, attendance_date, status } = req.body;

    const query = `INSERT INTO attendance (student_id, attendance_date, status) VALUES ($1, $2, $3) RETURNING *`;

    try {
        const result = await pool.query(query, [student_id, attendance_date, status || 'Present']);
        res.json({ data: result.rows[0], message: 'Attendance recorded successfully' });
    } catch (err) {
        console.error('PostgreSQL error:', err);
        res.status(400).json({ error: err.message });
    }
});

// Endpoint to get attendance by standard
app.get('/attendance_by_standard', async (req, res) => {
    const { standard, attendance_date } = req.query;

    const query = `
        SELECT c.id, c.name, a.status 
        FROM children_profiles c
        LEFT JOIN attendance a 
        ON c.id = a.student_id AND a.attendance_date = $1
        WHERE c.standard = $2
    `;

    try {
        const result = await pool.query(query, [attendance_date, standard]);
        res.json(result.rows);
    } catch (err) {
        console.error('PostgreSQL error:', err);
        res.status(400).json({ error: err.message });
    }
});

// Endpoint to get all children profiles
app.get('/children_profiles', async (req, res) => {
    const query = 'SELECT * FROM children_profiles';

    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('PostgreSQL error:', err);
        res.status(400).json({ error: err.message });
    }
});

// Endpoint to get a child profile by admission number
app.get('/child_profile/:admission_number', async (req, res) => {
    const admission_number = req.params.admission_number;
    const query = 'SELECT * FROM children_profiles WHERE admission_number = $1';

    try {
        const result = await pool.query(query, [admission_number]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PostgreSQL error:', err);
        res.status(400).json({ error: err.message });
    }
});

// Endpoint to get teacher profiles
app.get('/teacher_profiles', async (req, res) => {
    const query = 'SELECT * FROM teacher_profiles';

    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('PostgreSQL error:', err);
        res.status(400).json({ error: err.message });
    }
});

// Endpoint for user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = $1';

    try {
        const result = await pool.query(query, [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log('Wrong Password');
            return res.status(401).send('Invalid credentials');
        }

        // Generate a fake token (use JWT in production)
        const token = 'example-token'; // Replace with JWT for real apps
        res.json({ token });
        console.log('User logged in:', user.username);
    } catch (err) {
        console.error('PostgreSQL error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if username already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );

        // Return the newly created user
        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0],
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Welcome endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Sunday School App API');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
