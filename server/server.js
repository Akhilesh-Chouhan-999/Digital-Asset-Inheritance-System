import app from "./app.js";
import connectDB from "./src/config/db.config.js";
import { PORT } from "./src/utils/env.js";



const startServer = async () => {

  try {
    connectDB();

    app.listen(PORT, () => {
      console.log(`Server is listening on PORT ${PORT}`);
    });

  } catch (error) {
    console.log('Server Startup Failed ');
    process.exit();
  }
}

startServer();