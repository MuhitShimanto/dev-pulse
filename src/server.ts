import app from "./app";
import config from "./config";
import { initDb } from "./db";

(async () => {
  try {
    await initDb();
    app.listen(config.port, () => {
      console.log(`🌐✅ Server is running on port ${config.port}`);
    });
  } catch (error) {
    throw new Error(`🌐❌ Failed to start server: ${error}`);
  }
})();
