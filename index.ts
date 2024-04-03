import client, { Channel, Connection, ConsumeMessage } from "amqplib";

function sendMessages(channel: Channel): void {
  for (let i = 0; i < 10; i++) {
    channel.sendToQueue("myQueue", Buffer.from(`Message ${i}`));
  }
}

const consumer = (channel: Channel) => (msg: ConsumeMessage | null) => {
  if (msg) {
    console.log(msg.content.toString());
    channel.ack(msg);
  }
};

const go = async () => {
  const conn: Connection = await client.connect(
    "amqp://root:root@localhost:5672"
  );
  const channel: Channel = await conn.createChannel();
  await channel.assertQueue("myQueue");
  sendMessages(channel);
  await channel.consume("myQueue", consumer(channel));
};

go();
