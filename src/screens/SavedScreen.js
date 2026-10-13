
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import COLORS from "../constants/colors";
import { getFavorites, toggleFavorite } from "../services/favoritesService";

export default function SavedScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  const load = useCallback(async () => {
    setFavorites(await getFavorites());
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const removeFavorite = async (place) => {
    setFavorites(await toggleFavorite(place));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Saved Places</Text>
      <Text style={styles.subtitle}>
        Your favourite destinations and restaurants in one place.
      </Text>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyText}>
            Explore destinations and tap the heart to save them here.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Explore")}
          >
            <Text style={styles.buttonText}>Explore places</Text>
          </TouchableOpacity>
        </View>
      ) : (
        favorites.map((place, index) => (
          <View key={`${place.cuisine ? "restaurant" : "place"}-${place.id}-${index}`} style={styles.card}>
            <TouchableOpacity
              style={styles.cardMain}
              onPress={() => navigation.navigate("PlaceDetails", { place })}
            >
              {place.image ? (
                <Image source={{ uri: place.image }} style={styles.image} />
              ) : (
                <View style={styles.imageFallback}>
                  <Text>📍</Text>
                </View>
              )}
              <View style={styles.details}>
                <Text style={styles.name}>{place.name}</Text>
                <Text style={styles.meta}>
                  {place.type || place.cuisine || "Place"}
                </Text>
                <Text style={styles.rating}>⭐ {place.rating ?? "New"}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.remove}
              onPress={() => removeFavorite(place)}
            >
              <Text style={styles.removeText}>♥</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 35,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 7,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },
  empty: {
    marginTop: 35,
    padding: 25,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    color: "#E34D68",
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 8,
    textAlign: "center",
    lineHeight: 21,
    color: COLORS.textSecondary,
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  card: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    backgroundColor: COLORS.white,
  },
  cardMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 82,
    height: 82,
    borderRadius: 12,
  },
  imageFallback: {
    width: 82,
    height: 82,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F2EF",
  },
  details: {
    flex: 1,
    marginLeft: 13,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  meta: {
    marginTop: 5,
    color: COLORS.textSecondary,
  },
  rating: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.text,
  },
  remove: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F2",
    marginLeft: 8,
  },
  removeText: {
    fontSize: 22,
    color: "#E34D68",
  },
});
