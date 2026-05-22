import app from "./app.js";
import config from "./config/index.js";
import { initDb } from "./db/index.js";

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
