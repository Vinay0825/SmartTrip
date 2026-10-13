
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import COLORS from "../constants/colors";
import PlaceCard from "../components/PlaceCard";
import { nearbyPlaces, restaurants } from "../data/mockData";
import { getFavorites, toggleFavorite } from "../services/favoritesService";

const categories = ["All", "Places", "Restaurants"];

export default function ExploreScreen({ navigation }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    setFavorites(await getFavorites());
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadFavorites);
    loadFavorites();
    return unsubscribe;
  }, [navigation]);

  const items = useMemo(() => {
    const source =
      category === "Restaurants"
        ? restaurants
        : category === "Places"
        ? nearbyPlaces.filter((place) => place.type !== "Restaurant")
        : [...nearbyPlaces, ...restaurants];

    const query = search.trim().toLowerCase();
    return source.filter((item) =>
      `${item.name} ${item.type || ""} ${item.cuisine || ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [category, search]);

  const openPlace = (place) => {
    navigation.navigate("PlaceDetails", { place });
  };

  const savePlace = async (place) => {
    setFavorites(await toggleFavorite(place));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subtitle}>Find your next favourite place.</Text>

      <TextInput
        style={styles.search}
        placeholder="Search places or restaurants..."
        placeholderTextColor={COLORS.textSecondary}
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryRow}
      >
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.category, category === item && styles.activeCategory]}
            onPress={() => setCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                category === item && styles.activeCategoryText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Discover places</Text>
        <Text style={styles.count}>{items.length} results</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No places found</Text>
          <Text style={styles.emptyText}>Try another search or category.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((place) => {
            const saved = favorites.some((item) => item.id === place.id);
            return (
              <TouchableOpacity
                key={`${place.cuisine ? "restaurant" : "place"}-${place.id}`}
                style={styles.item}
                activeOpacity={0.85}
                onPress={() => openPlace(place)}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{place.name}</Text>
                  <Text style={styles.itemMeta}>
                    {place.type || place.cuisine || "Place"} · {place.distance || "Distance unavailable"}
                  </Text>
                  <Text style={styles.rating}>⭐ {place.rating ?? "New"}</Text>
                </View>
                <TouchableOpacity
                  style={styles.heart}
                  onPress={() => savePlace(place)}
                  accessibilityLabel={saved ? "Remove from saved places" : "Save place"}
                >
                  <Text style={styles.heartText}>{saved ? "♥" : "♡"}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  search: {
    marginTop: 22,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: "#E4EAE7",
  },
  categoryRow: {
    marginTop: 18,
    maxHeight: 48,
  },
  category: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    marginRight: 9,
  },
  activeCategory: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  activeCategoryText: {
    color: COLORS.white,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.text,
  },
  count: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  list: {
    gap: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    elevation: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  itemMeta: {
    marginTop: 5,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  rating: {
    marginTop: 7,
    fontSize: 13,
    color: COLORS.text,
  },
  heart: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F2",
    marginLeft: 12,
  },
  heartText: {
    fontSize: 25,
    color: "#E34D68",
  },
  empty: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 7,
    color: COLORS.textSecondary,
  },
});
