import { createServer } from "node:http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Buraya Next.js frontend URL'ni koyabilirsin
  },
});

io.on("connection", (socket) => {
  console.log("Kullanıcı bağlandı: " + socket.id);

  // Odaya katılma
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`${socket.id}, ${room} odasına katıldı`);
    socket.to(room).emit("message", `🔵 Yeni kullanıcı ${room} odasına katıldı.`);
  });

  // Mesaj gönderme
  socket.on("sendMessage", ({ room, message, username }) => {
    io.to(room).emit("message", `💬 ${username}: ${message}`);
  });

  // Kullanıcı ayrılınca
  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı: " + socket.id);
  });
});

server.listen(4000, () => {
  console.log("Socket.io sunucu çalışıyor: http://localhost:4000");
});
