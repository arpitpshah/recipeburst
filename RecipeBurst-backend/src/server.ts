import app from './app';
import * as dotenv from 'dotenv';
import { logToCloudWatch } from './utils/cloudwatchLogger';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  logToCloudWatch("Server is running",PORT)
});
