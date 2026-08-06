import fs from "fs";
import path from "path";
import type {
  AdvertisementsDataFile,
  AuthorsDataFile,
  CategoriesDataFile,
  FeaturedDataFile,
  MenuDataFile,
  PostsDataFile,
  SettingsDataFile,
  TagsDataFile,
  TrendingDataFile,
  WidgetsDataFile,
  HomeDataFile,
} from "@/types/data";

const DATA_DIR = path.join(process.cwd(), "data");

function readDataFile<T>(filename: string): T {
  const raw = fs.readFileSync(path.join(DATA_DIR, filename), "utf8");
  return JSON.parse(raw) as T;
}

export function loadPostsFile(): PostsDataFile {
  return readDataFile("posts.json");
}

export function loadCategoriesFile(): CategoriesDataFile {
  return readDataFile("categories.json");
}

export function loadTagsFile(): TagsDataFile {
  return readDataFile("tags.json");
}

export function loadAuthorsFile(): AuthorsDataFile {
  return readDataFile("authors.json");
}

export function loadFeaturedFile(): FeaturedDataFile {
  return readDataFile("featured.json");
}

export function loadTrendingFile(): TrendingDataFile {
  return readDataFile("trending.json");
}

export function loadAdvertisementsFile(): AdvertisementsDataFile {
  return readDataFile("advertisements.json");
}

export function loadMenuFile(): MenuDataFile {
  return readDataFile("menu.json");
}

export function loadSettingsFile(): SettingsDataFile {
  return readDataFile("settings.json");
}

export function loadWidgetsFile(): WidgetsDataFile {
  return readDataFile("widgets.json");
}

export function loadHomeFile(): HomeDataFile {
  return readDataFile("home.json");
}
