const basicAuth = require('basic-auth');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

const authenticate = async (req, res, next) => {
  const credentials = basicAuth(req);

  if (!credentials) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const [rows] = await pool.query('SELECT * FROM admin WHERE username = ?', [credentials.name]);
    
    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const validPassword = await bcrypt.compare(credentials.pass, rows[0].password);
    
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};

module.exports = authenticate;
