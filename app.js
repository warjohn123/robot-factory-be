import express, { json } from "express";
import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import cors from "cors";
const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

const app = express();

app.use(cors());

app.use(json());

const PORT = process.env.PORT || 3001;

app.get("/robots", async (req, res) => {
  await db.read();
  const { robots } = db.data;

  res.json(robots.slice(0, 10));
});

app.post("/robots/:id/extinguish", async (req, res) => {
  const { id } = req.params;
  const { statuses } = req.body;

  await db.read();
  let { robots } = db.data;

  const robotIndex = robots.findIndex((robot) => robot.id === parseInt(id));
  if (robotIndex !== -1) robots[robotIndex].statuses = statuses;
  db.data.robots = robots;
  await db.write();

  res.json({ status: "Ok" });
});

app.post("/robots/recycle", async (req, res) => {
  const { recycleRobots } = req.body;

  await db.read();
  let { robots } = db.data;

  robots = robots.filter((robot) => {
    if (!recycleRobots.includes(robot.id)) {
      return robot;
    }
  });

  db.data.robots = robots;
  await db.write();

  res.json({ status: "Ok" });
});

app.put("/shipments/create", async (req, res) => {
  const { shipmentRobots } = req.body;

  await db.read();
  let { robots } = db.data;

  robots = robots.filter((robot) => {
    if (!shipmentRobots.includes(robot.id)) {
      return robot;
    }
  });

  db.data.robots = robots;
  await db.write();

  res.json({ status: "Ok" });
});

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
