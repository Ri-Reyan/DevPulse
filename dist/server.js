import http from "http";
import app from "./app.js";
import { config } from "./config/secretEnvs.js";
import initDB from "./config/db.js";
const server = http.createServer(app);
initDB();
server.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
//# sourceMappingURL=server.js.map
