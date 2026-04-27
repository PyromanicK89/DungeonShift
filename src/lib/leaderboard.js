import { supabase } from "./supabase.js";

const TABLE = "leaderboard";

function toRow(entry) {
  return {
    player_name: entry.playerName || entry.player_name || "Anonymous",
    class_name: entry.className,
    result: entry.result,
    kills: entry.kills,
    level: entry.level,
    shards: entry.shards,
    boss: entry.boss,
    score: entry.score,
  };
}

function fromRow(row) {
  return {
    playerName: row.player_name,
    className: row.class_name,
    result: row.result,
    kills: row.kills,
    level: row.level,
    shards: row.shards,
    boss: row.boss,
    score: row.score,
    date: row.created_at ? new Date(row.created_at).toLocaleDateString() : "",
  };
}

export async function submitScore(entry) {
  if (!supabase) return { ok: false, reason: "Supabase is not configured" };

  const { error } = await supabase
    .from(TABLE)
    .insert(toRow(entry));

  if (error) throw error;
  return { ok: true };
}

export async function loadLeaderboard(limit = 10) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("score", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(fromRow);
}
