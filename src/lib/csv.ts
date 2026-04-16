import { supabase } from "./supabase";
import type { Config, Creator, Video } from "./types";

// Configs
export async function readConfigs(): Promise<Config[]> {
  const { data, error } = await supabase.from("configs").select("*");
  if (error) { console.error(error); return []; }
  return (data || []).map((r) => ({
    id: r.id,
    configName: r.name,
    creatorsCategory: r.target_audience,
    analysisInstruction: r.tone,
    newConceptsInstruction: r.keywords?.join(", ") || "",
  }));
}

export async function writeConfigs(configs: Config[]) {
  for (const c of configs) {
    await supabase.from("configs").upsert({
      id: c.id,
      name: c.configName,
      target_audience: c.creatorsCategory,
      tone: c.analysisInstruction,
      keywords: c.newConceptsInstruction?.split(",").map((k) => k.trim()),
    });
  }
}

// Creators
export async function readCreators(): Promise<Creator[]> {
  const { data, error } = await supabase.from("creators").select("*");
  if (error) { console.error(error); return []; }
  return (data || []).map((r) => ({
    id: r.id,
    username: r.username,
    category: r.category || "",
    profilePicUrl: r.profile_pic_url || "",
    followers: r.followers || 0,
    reelsCount30d: r.reels_count_30d || 0,
    avgViews30d: r.avg_views_30d || 0,
    lastScrapedAt: r.last_scraped_at || "",
  }));
}

export async function writeCreators(creators: Creator[]) {
  for (const c of creators) {
    await supabase.from("creators").upsert({
      id: c.id,
      username: c.username,
      category: c.category,
      profile_pic_url: c.profilePicUrl,
      followers: c.followers,
      reels_count_30d: c.reelsCount30d,
      avg_views_30d: c.avgViews30d,
      last_scraped_at: c.lastScrapedAt || null,
    });
  }
}

// Videos
export async function readVideos(): Promise<Video[]> {
  const { data, error } = await supabase.from("videos").select("*");
  if (error) { console.error(error); return []; }
  return (data || []).map((r) => ({
    id: r.id,
    link: r.url || "",
    thumbnail: r.thumbnail_url || "",
    creator: r.username || "",
    views: r.views || 0,
    likes: r.likes || 0,
    comments: r.comments || 0,
    analysis: typeof r.analysis === "string" ? r.analysis : JSON.stringify(r.analysis || ""),
    newConcepts: r.new_concepts || "",
    datePosted: r.scraped_at || "",
    dateAdded: r.scraped_at || "",
    configName: r.config_name || "",
    starred: r.starred || false,
  }));
}

export async function writeVideos(videos: Video[]) {
  for (const v of videos) {
    await supabase.from("videos").upsert({
      id: v.id,
      url: v.link,
      thumbnail_url: v.thumbnail,
      username: v.creator,
      views: v.views,
      likes: v.likes,
      comments: v.comments,
      analysis: v.analysis,
      new_concepts: v.newConcepts,
      config_name: v.configName,
      starred: v.starred,
    });
  }
}

export async function appendVideo(video: Video) {
  await supabase.from("videos").insert({
    id: video.id,
    url: video.link,
    thumbnail_url: video.thumbnail,
    username: video.creator,
    views: video.views,
    likes: video.likes,
    comments: video.comments,
    analysis: video.analysis,
    new_concepts: video.newConcepts,
    config_name: video.configName,
    starred: video.starred,
  });
}
