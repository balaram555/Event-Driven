const express = require("express");
const activityRoutes = require("./routes/activityRoutes");
const connectRabbitMQ = require("./rabbitmq/connection");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/v1/activities", activityRoutes);

const PORT = process.env.API_PORT || 3000;

async function startServer() {

  try {

    const { channel } = await connectRabbitMQ();

    // store channel globally
    app.locals.channel = channel;

    console.log("✅ RabbitMQ connected in API");

    app.listen(PORT, () => {
      console.log(`🚀 API running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server", error);
  }

}

startServer();