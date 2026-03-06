const QUEUE = "user_activities";

exports.ingestActivity = async (req, res) => {

  try {

    const channel = req.app.locals.channel;

    if (!channel) {
      console.error("❌ RabbitMQ channel not initialized");
      return res.status(500).json({
        error: "RabbitMQ not ready"
      });
    }

    const { userId, eventType, timestamp, payload } = req.body;

    if (!userId || !eventType || !timestamp) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const message = JSON.stringify({
      userId,
      eventType,
      timestamp,
      payload
    });

    await channel.assertQueue(QUEUE, { durable: true });

    channel.sendToQueue(
      QUEUE,
      Buffer.from(message),
      { persistent: true }
    );

    console.log("📤 Activity sent to RabbitMQ");

    res.status(202).json({
      message: "Activity queued"
    });

  } catch (error) {

    console.error("❌ Error ingesting activity:", error);

    res.status(500).json({
      error: "Internal server error"
    });

  }

};