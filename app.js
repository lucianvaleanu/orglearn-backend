require('./config/env');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');

const { sequelize } = require('./models');
require('./auth.config');
const authRoutes = require('./routes/auth');
const scenarioRoutes = require('./routes/scenarios');
const domainRoutes = require('./routes/domains');
const attemptRoutes = require('./routes/attempts');
const userRoutes = require('./routes/user');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/user', userRoutes);
app.use('/scenarios', scenarioRoutes);
app.use(errorHandler);

const port = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
})();
