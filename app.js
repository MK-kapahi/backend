const express = require('express')
const app = express();
const mongoDB = require("./database/connection");
const cors = require('cors');
const http = require('http');
const bodyParser = require("body-parser");
const { Port } = require("./config")
const server = http.createServer(app);
const routes = require("./Routes/routes")
const initializeSocket = require('./socket');
app.use(express.json());


const io = initializeSocket(server);

const listenWebHook = async (req, res) => {
  try {

    console.log(req.body)
    console.log(res)
    if (req.body.resource.status == 'APPROVED') {
      const paymentRes = await captureOrder(req.body.resource.id)

      if (paymentRes) {
        io.emit('paymentResponse', paymentRes)
      }
      else {
        console.log("connection error")
      }
    } else {
      console.log("Order status is not APPROVED. Ignoring.");
      res.status(200).send("Webhook received, but order status is not APPROVED.");
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Internal Server Error");
  }

}
app.post("/listenWebHook", listenWebHook)
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1", routes)
mongoDB.then(connected => {
  server.listen(Port, () => {
    console.log(`App running on port ${Port} and DataBase is also connected`);
  });


}).catch(connectionError => {
  console.log(`Error connecting to the database App crashed`, connectionError);
});