const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { sequelize } = require('./models');
const scenarioRoutes = require('./routes/scenarios');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

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
