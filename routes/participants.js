const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Validation helper
const validateParticipant = (data) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!data.email || !emailRegex.test(data.email)) return "Invalid email format";
  if (!data.firstname || !data.lastname) return "First name and last name are required";
  if (!data.dob || !dateRegex.test(data.dob)) return "Invalid date format (YYYY-MM-DD)";
  if (!data.work?.companyname || !data.work?.salary || !data.work?.currency) return "Work details are incomplete";
  if (!data.home?.country || !data.home?.city) return "Home details are incomplete";
  
  return null;
};

// Add participant
router.post('/add', async (req, res) => {
  const validationError = validateParticipant(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    await pool.query('INSERT INTO participants SET ?', [{
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      dob: req.body.dob
    }]);

    await pool.query('INSERT INTO work SET ?', [{
      participant_email: req.body.email,
      companyname: req.body.work.companyname,
      salary: req.body.work.salary,
      currency: req.body.work.currency
    }]);

    await pool.query('INSERT INTO home SET ?', [{
      participant_email: req.body.email,
      country: req.body.home.country,
      city: req.body.home.city
    }]);

    res.status(201).json({ message: 'Participant added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add participant' });
  }
});

// Get all participants
router.get('/', async (req, res) => {
  try {
    const [participants] = await pool.query(`
      SELECT p.*, w.*, h.*
      FROM participants p
      LEFT JOIN work w ON p.email = w.participant_email
      LEFT JOIN home h ON p.email = h.participant_email
    `);
    res.json({ participants });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// Additional endpoints as per requirements...

module.exports = router;
