const socketEvents = (socket) => {
  // Listen for a custom event from the client
  socket.on("custom-event", (data) => {
    console.log("Custom event received:", data);
  });
};
export default socketEvents;
