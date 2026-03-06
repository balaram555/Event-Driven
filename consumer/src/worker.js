const amqp = require("amqplib");
const mongoose = require("mongoose");
const processActivity = require("./services/activityProcessor");

const QUEUE = "user_activities";

async function connectRabbit() {
  const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  while (true) {
    try {
      const conn = await amqp.connect(url);
      console.log("✅ Connected to RabbitMQ");
      return conn;
    } catch (err) {
      console.log("⏳ Waiting for RabbitMQ...");
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

async function startWorker() {

  await mongoose.connect(process.env.DATABASE_URL);
  console.log("✅ MongoDB connected");

  const conn = await connectRabbit();

  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  console.log("📥 Worker waiting for messages...");

  channel.consume(QUEUE, async (msg) => {

    try {

      const data = JSON.parse(msg.content.toString());

      await processActivity(data);

      channel.ack(msg);

    } catch (error) {

      console.error("Processing error:", error);

      channel.nack(msg, false, true);

    }

  });
}

startWorker();