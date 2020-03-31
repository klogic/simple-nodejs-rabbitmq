require("dotenv").config();
const amqp = require("amqplib/callback_api");
const { getPosts } = require("./firerequest");

amqp.connect("amqp://" + process.env.RABBITMQ_URL, (err, conn) => {
  conn.createChannel((err, ch) => {
    var ex = "posts";

    ch.assertExchange(ex, "fanout", { durable: false });

    ch.assertQueue("", { exclusive: true }, (err, q) => {
      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        q.queue
      );
      ch.bindQueue(q.queue, ex, "");

      ch.consume(q.queue, async msg => {
        ch.ack(msg);
        const url = msg.content.toString();
        const post = await getPosts(url);
        console.log(post);
      });
    });
  });
});
