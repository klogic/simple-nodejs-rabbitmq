require("dotenv").config();
const amqp = require("amqplib/callback_api");

amqp.connect("amqp://" + process.env.RABBITMQ_URL, function(err, conn) {
  if (err) {
    console.log("error", err);
  } else {
    const url = "https://jsonplaceholder.typicode.com";
    conn.createChannel(function(err, ch) {
      for (let postIndex = 1; postIndex < 15; postIndex++) {
        const ex = "posts";
        const msg = `${url}/posts/${postIndex}`;

        ch.assertExchange(ex, "fanout", { durable: false });
        ch.publish(ex, "", new Buffer(msg));
        console.log(" [x] Sent %s", msg);
      }
    });
    setTimeout(function() {
      conn.close();
      process.exit(0);
    }, 500);
  }
});
