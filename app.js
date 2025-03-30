const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authenticate = require('./middleware/auth');
const participantsRouter = require('./routes/participants');

const app = express();

app.use(cors());
app.use(express.json());

// Protected routes
app.use('/participants', authenticate, participantsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
