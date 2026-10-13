
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import COLORS from "../constants/colors";
import { isFavorite, toggleFavorite } from "../services/favoritesService";

export default function PlaceCard({ place, onPress }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    isFavorite(place.id).then((value) => {
      if (active) setSaved(value);
    });
    return () => {
      active = false;
    };
  }, [place.id]);

  const handleFavorite = async () => {
    const updated = await toggleFavorite(place);
    setSaved(updated.some((item) => item.id === place.id));
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View>
        <Image source={{ uri: place.image }} style={styles.image} />
        <TouchableOpacity
          style={styles.heart}
          onPress={handleFavorite}
          accessibilityLabel={saved ? "Remove from saved places" : "Save place"}
        >
          <Text style={styles.heartText}>{saved ? "♥" : "♡"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.type}>{place.type || place.cuisine || "Place"}</Text>
        <View style={styles.row}>
          <Text style={styles.distance}>📍 {place.distance || "Distance unavailable"}</Text>
          <Text style={styles.rating}>⭐ {place.rating ?? "New"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    marginRight: 14,
    marginBottom: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 130,
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  heartText: {
    fontSize: 23,
    color: "#E34D68",
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  type: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  distance: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  rating: {
    fontSize: 12,
    fontWeight: "600",
  },
});
