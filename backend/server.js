const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

app.use(cors());
app.use(express.json());

require('dotenv').config();
const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

console.log(`Server running on port ${PORT}`);

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }));
  
// Initialize SQLite database
const db = new sqlite3.Database('./sunday_school.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Create users table for authentication
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

// Create children_profiles table
db.run(`CREATE TABLE IF NOT EXISTS children_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT, 
    dob TEXT, 
    age INTEGER, 
    gender TEXT, 
    religion TEXT, 
    denomination TEXT, 
    baptism_date TEXT, 
    holy_spirit_date TEXT,
    doa TEXT, 
    standard TEXT, 
    medium TEXT, 
    admission_number TEXT, 
    location TEXT, 
    address TEXT, 
    student_mobile_1 TEXT, 
    student_mobile_2 TEXT,
    father_name TEXT, 
    father_religion TEXT, 
    father_denomination TEXT, 
    father_baptism_date TEXT, 
    father_holy_spirit_date TEXT, 
    father_mobile TEXT, 
    mother_name TEXT, 
    mother_religion TEXT, 
    mother_denomination TEXT, 
    mother_baptism_date TEXT, 
    mother_holy_spirit_date TEXT, 
    mother_mobile TEXT
)`);

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
app.post('/children_profile_form', (req, res) => {
    const {
        name, dob, gender, religion, denomination, baptism_date, holy_spirit_date,
        doa, standard, medium, admission_number, location, address, student_mobile_1, student_mobile_2,
        father_name, father_religion, father_denomination, father_baptism_date, father_holy_spirit_date, father_mobile,
        mother_name, mother_religion, mother_denomination, mother_baptism_date, mother_holy_spirit_date, mother_mobile
    } = req.body;

    const age = calculateAge(dob);

    const sql = `INSERT INTO children_profiles (name, dob, age, gender, religion, denomination, baptism_date, holy_spirit_date, 
    doa, standard, medium, admission_number, location, address, student_mobile_1, student_mobile_2, 
    father_name, father_religion, father_denomination, father_baptism_date, father_holy_spirit_date, father_mobile, 
    mother_name, mother_religion, mother_denomination, mother_baptism_date, mother_holy_spirit_date, mother_mobile)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [
        name, dob, age, gender, religion, denomination, baptism_date, holy_spirit_date, doa, standard, medium,
        admission_number, location, address, student_mobile_1, student_mobile_2, father_name, father_religion,
        father_denomination, father_baptism_date, father_holy_spirit_date, father_mobile, mother_name, mother_religion,
        mother_denomination, mother_baptism_date, mother_holy_spirit_date, mother_mobile
    ], function (err) {
        if (err) {
            console.error('SQLite error:', err.message);
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Child profile created successfully' });
    });
});

// Create attendance table
db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    attendance_date TEXT,
    status TEXT DEFAULT 'Present',
    FOREIGN KEY (student_id) REFERENCES children_profiles(id)
)`);

// Endpoint to add attendance
app.post('/attendance', (req, res) => {
    const { student_id, attendance_date, status } = req.body;

    const sql = `INSERT INTO attendance (student_id, attendance_date, status) VALUES (?, ?, ?)`;

    db.run(sql, [student_id, attendance_date, status || 'Present'], function (err) {
        if (err) {
            console.error('SQLite error:', err.message);
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Attendance recorded successfully' });
    });
});

// Endpoint to get attendance by standard
app.get('/attendance_by_standard', (req, res) => {
    const { standard, attendance_date } = req.query;

    const sql = `
        SELECT c.id, c.name, a.status 
        FROM children_profiles c
        LEFT JOIN attendance a 
        ON c.id = a.student_id AND a.attendance_date = ?
        WHERE c.standard = ?
    `;

    db.all(sql, [attendance_date, standard], (err, rows) => {
        if (err) {
            console.error('SQLite error:', err.message);
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/children_profiles',(req, res)=> {
    const sql='SELECT * FROM children_profiles';
    db.all(sql, [], (err, rows)=> {
        if(err){
            return res.status(400).json({error:err.message});
        }
        res.json(rows);
    });
});

app.get('/child_profile/:admission_number', (req, res) => {
    const admission_number = req.params.admission_number;
    const sql = 'SELECT * FROM children_profiles WHERE admission_number = ?';
    db.get(sql, [admission_number], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});


app.get('/teacher_profiles', (req, res) => {
    const sql = `SELECT * FROM teacher_profiles`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Generate a fake token (use JWT in production)
        const token = 'example-token'; // Replace with JWT for real apps
        res.json({ token });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to the Sunday School App API');
});