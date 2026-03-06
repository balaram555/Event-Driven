const amqp = require("amqplib");

const connectRabbitMQ = async () => {
  const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  while (true) {
    try {
      console.log("⏳ Connecting to RabbitMQ...");

      const connection = await amqp.connect(url);
      const channel = await connection.createChannel();

      console.log("✅ Connected to RabbitMQ");

      return { connection, channel };

    } catch (error) {
      console.log("❌ RabbitMQ not ready, retrying in 5 seconds...");
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectRabbitMQ;