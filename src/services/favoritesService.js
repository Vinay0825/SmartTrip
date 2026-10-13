
import { getData, saveData } from "./storageService";

const FAVORITES_KEY = "smarttrip_favorites";

export async function getFavorites() {
  return (await getData(FAVORITES_KEY)) || [];
}

export async function isFavorite(id) {
  const favorites = await getFavorites();
  return favorites.some((item) => item.id === id);
}

export async function toggleFavorite(place) {
  const favorites = await getFavorites();
  const exists = favorites.some((item) => item.id === place.id);

  const updated = exists
    ? favorites.filter((item) => item.id !== place.id)
    : [...favorites, place];

  await saveData(FAVORITES_KEY, updated);
  return updated;
}
