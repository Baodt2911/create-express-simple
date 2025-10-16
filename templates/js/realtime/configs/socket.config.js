import socketEvents from "../events/index.js";

export const configSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("<<<<<Connected to socket>>>>> : ", socket.id);

    socketEvents(socket);

    socket.on("disconnect", () => {
      console.log("<<<<<Disconnected to socket>>>>>");
    });
  });
};
