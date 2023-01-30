const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`server running or port ${PORT}`));