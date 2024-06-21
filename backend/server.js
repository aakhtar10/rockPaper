const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = 4000;
let players = [];
let games = [];
let leaderboard = {};
let waitingList = [];

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join", (username) => {
    players.push({ id: socket.id, username, score: 0 });
    io.emit("updatePlayers", players);
    io.emit("updateLeaderboard", leaderboard);
  });

  socket.on("challenge", (challengerId, opponentId) => {
    if (games.includes(opponentId)) {
      waitingList.push(challengerId);
      socket.emit("waiting", "The player is already in a game");
    } else {
      startGame(challengerId, opponentId);
    }
  });

  socket.on("play", ({ playerId, opponentId, choice, opponentChoice }) => {
    const player = players.find((p) => p.id === playerId);
    const opponent = players.find((p) => p.id === opponentId);
  
    let result;
    if (
      (choice === "rock" && opponentChoice === "scissors") ||
      (choice === "paper" && opponentChoice === "rock") ||
      (choice === "scissors" && opponentChoice === "paper")
    ) {
      result = "win";
      player.score += 1;
    } else if (
      (choice === "rock" && opponentChoice === "paper") ||
      (choice === "paper" && opponentChoice === "scissors") ||
      (choice === "scissors" && opponentChoice === "rock")
    ) {
      result = "lose";
      opponent.score += 1;
    } else {
      result = "draw";
    }
  
    io.to(playerId).emit("result", { result, playerScore: player.score, opponentScore: opponent.score });
    io.to(opponentId).emit("result", { result: result === "win" ? "lose" : result === "lose" ? "win" : "draw", playerScore: opponent.score, opponentScore: player.score });
  });
  
  
  socket.on("result", ({ result, playerId, opponentId }) => {
    const player = players.find((p) => p.id === playerId);
    const opponent = players.find((p) => p.id === opponentId);
    
    if (result === "win") {
      player.score += 1;
    } else if (result === "lose") {
      opponent.score += 1;
    }
    
    endGame(playerId, opponentId);
  });
  

  socket.on("disconnect", () => {
    players = players.filter((player) => player.id !== socket.id);
    io.emit("updatePlayers", players);
    console.log("User Disconnected", socket.id);
  });
});
  
const calculateScores = () => {
    const scores = {};
    players.forEach((player) => {
      scores[player.username] = player.score;
    });
    return scores;
  };
  
function startGame(player1Id, player2Id) {
  games.push(player1Id, player2Id);
  io.to(player1Id).emit("startGame", player2Id);
  io.to(player2Id).emit("startGame", player1Id);
}

function endGame(player1Id, player2Id) {
    games = games.filter((id) => id != player1Id && id != player2Id);
    if (waitingList.length > 0) {
      const nextPlayer = waitingList.shift();
      const availablePlayer = players.find(
        (player) => !games.includes(player.id)
      );
      if (availablePlayer) {
        startGame(availablePlayer.id, nextPlayer);
      } else {
        waitingList.unshift(nextPlayer);
      }
    }
    
    // Calculate scores and update leaderboard
    const scores = calculateScores();
    io.emit("updateLeaderboard", scores);
    
    io.emit("result", {
      result: "done",
      player: player1Id,
      opponent: player2Id,
    });
    io.to(player2Id).emit("result", {
      result: "done",
      player: player2Id,
      opponent: player1Id,
    });
  }
  

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
