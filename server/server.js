import app from "./app.js";
import connectDB from "./src/config/db.config.js";
import { PORT } from "./src/utils/env.js";
import { startInactivityScheduler } from "./src/jobs/inactivityScheduler.js";
import logger from "./src/utils/logger.js";



const startServer = async () => {

  try {
    // Connect to database
    await connectDB();

    // Start the inactivity scheduler
    startInactivityScheduler();

    app.listen(PORT, () => {
      logger.info(`Server is listening on PORT ${PORT}`);
      console.log(`Server is listening on PORT ${PORT}`);
    });

  } catch (error) {
    logger.error('Server Startup Failed:', error);
    console.error('Server Startup Failed:', error);
    process.exit();
  }
}

startServer();