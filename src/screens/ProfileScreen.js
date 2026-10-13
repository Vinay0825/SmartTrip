
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import COLORS from "../constants/colors";
import { getReviews } from "../services/reviewService";

export default function ProfileScreen() {
  const [reviews, setReviews] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getReviews()
        .then((data) => {
          if (active) {
            setReviews(Array.isArray(data) ? data : []);
          }
        })
        .catch((error) => {
          console.error("Error loading reviews:", error);
        });

      return () => {
        active = false;
      };
    }, [])
  );

  const totalPhotos = reviews.filter((item) => item.photo).length;
  const totalPlaces = new Set(
    reviews.map((item) => item.placeId || item.placeName).filter(Boolean)
  ).size;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>V</Text>
      </View>

      <Text style={styles.name}>My Travel Profile</Text>

      <Text style={styles.subtitle}>
        Your personal travel preferences
      </Text>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.number}>5</Text>
          <Text style={styles.label}>Trips</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.number}>{totalPlaces}</Text>
          <Text style={styles.label}>Reviewed Places</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.number}>{totalPhotos}</Text>
          <Text style={styles.label}>Photos</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Favorite Categories</Text>

        <Text style={styles.preference}>🌄 Nature        ⭐⭐⭐⭐⭐</Text>
        <Text style={styles.preference}>🍽️ Food          ⭐⭐⭐⭐⭐</Text>
        <Text style={styles.preference}>🏛️ History       ⭐⭐⭐</Text>
        <Text style={styles.preference}>🛍️ Shopping      ⭐⭐⭐⭐</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          My Reviews ({reviews.length})
        </Text>

        {reviews.length === 0 ? (
          <Text style={styles.emptyText}>
            You haven't written any reviews yet.
            {"\n"}Visit a place and share your experience!
          </Text>
        ) : (
          reviews.map((item, index) => {
            const stars = Math.max(
              0,
              Math.min(5, Number(item.rating) || 0)
            );

            return (
              <View
                key={item.id || `${item.placeName}-${index}`}
                style={styles.reviewItem}
              >
                <Text style={styles.placeName}>
                  {item.placeName || item.place?.name || "Unknown Place"}
                </Text>

                <Text style={styles.rating}>
                  {"★".repeat(stars)}
                  {"☆".repeat(5 - stars)}
                  {"  "}
                  {stars}/5
                </Text>

                <Text style={styles.reviewText}>
                  {item.review}
                </Text>

                {item.photo ? (
                  <Image
                    source={{ uri: item.photo }}
                    style={styles.reviewPhoto}
                    resizeMode="cover"
                    onError={(error) => {
                      console.log(
                        "Review image failed to load:",
                        error.nativeEvent?.error
                      );
                    }}
                  />
                ) : null}

                <Text style={styles.date}>
                  {item.date
                    ? new Date(item.date).toLocaleDateString()
                    : ""}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    alignItems: "center",
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: "800",
  },

  name: {
    marginTop: 15,
    fontSize: 23,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 5,
    color: COLORS.textSecondary,
  },

  stats: {
    width: "100%",
    marginTop: 30,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  number: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
  },

  label: {
    textAlign: "center",
    marginTop: 4,
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  card: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginTop: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: COLORS.text,
  },

  preference: {
    paddingVertical: 9,
    color: COLORS.textSecondary,
    fontSize: 15,
  },

  emptyText: {
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  reviewItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  placeName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  rating: {
    marginTop: 7,
    color: COLORS.star,
    fontSize: 15,
  },

  reviewText: {
    marginTop: 8,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  reviewPhoto: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: "#EEEEEE",
  },

  date: {
    marginTop: 8,
    color: COLORS.textLight,
    fontSize: 12,
  },
});
