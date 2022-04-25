// build server
var express = require("express");
var app = express();

var server = require("http").createServer(app);
var io = require("socket.io")(server);
server.listen(5000, () => {
  console.log("server listening on port 5000");
});

let count = 0;
// tạo kết nối giữa client và server
io.on("connection", function (socket) {
  console.log("socket connected");
  socket.on("disconnect", function () {
    console.log("Disconnect");
  });
  socket.on("send_message", (message) => {
    socket.emit("server_send_message", {
      id: count,
      message: message,
    });
    count++;
  });
});
