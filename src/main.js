import { loadLeaderboard, submitScore } from "./lib/leaderboard.js";

window.DungeonShiftLeaderboard = {
  loadLeaderboard,
  submitScore,
};

await import("../game.js");
