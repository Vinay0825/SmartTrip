import React from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import COLORS from "../constants/colors";

const itinerary = [
  { id: "1", time: "09:00 AM", title: "Visit local attractions", type: "Sightseeing" },
  { id: "2", time: "12:00 PM", title: "Lunch at a nearby restaurant", type: "Food" },
  { id: "3", time: "03:00 PM", title: "Explore popular places", type: "Activity" },
];

export default function TripDetailsScreen({
  route,
  navigation,
}) {
  const trip = route.params.trip;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {trip.name}
        </Text>

        <Text style={styles.destination}>
          📍 {trip.destination}
        </Text>

        <Text style={styles.date}>
          {trip.startDate} - {trip.endDate}
        </Text>
      </View>

      <View style={styles.stats}>
        <View>
          <Text style={styles.statNumber}>
            {trip.places || 0}
          </Text>
          <Text style={styles.statLabel}>
            Places
          </Text>
        </View>

        <View>
          <Text style={styles.statNumber}>
            {trip.photos || 0}
          </Text>
          <Text style={styles.statLabel}>
            Photos
          </Text>
        </View>

        <View>
          <Text style={styles.statNumber}>
            {trip.rating || "—"}
          </Text>
          <Text style={styles.statLabel}>
            Rating
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate(
              "Map",
              { trip }
            )
          }
        >
          <Text style={styles.actionIcon}>
            🗺️
          </Text>

          <Text style={styles.actionText}>
            Map
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate(
              "Explore"
            )
          }
        >
          <Text style={styles.actionIcon}>
            🧭
          </Text>

          <Text style={styles.actionText}>
            Explore
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate(
              "AddReview"
            )
          }
        >
          <Text style={styles.actionIcon}>
            ⭐
          </Text>

          <Text style={styles.actionText}>
            Review
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        Your Itinerary
      </Text>

      {itinerary.map((item, index) => (
        <View
          key={item.id}
          style={styles.timeline}
        >
          <View style={styles.timeContainer}>
            <Text style={styles.time}>
              {item.time}
            </Text>

            <View style={styles.dot} />
          </View>

          <View style={styles.timelineCard}>
            <Text style={styles.itemTitle}>
              {item.title}
            </Text>

            <Text style={styles.itemType}>
              {item.type}
            </Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addPlaceButton}
        onPress={() =>
          navigation.navigate("Explore")
        }
      >
        <Text style={styles.addPlaceText}>
          + Add Place to Itinerary
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

  header: {
    marginTop: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
  },

  destination: {
    marginTop: 8,
    fontSize: 15,
    color: COLORS.textSecondary,
  },

  date: {
    marginTop: 5,
    color: COLORS.textLight,
  },

  stats: {
    marginTop: 25,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  statNumber: {
    textAlign: "center",
    fontSize: 21,
    fontWeight: "800",
    color: COLORS.primary,
  },

  statLabel: {
    textAlign: "center",
    marginTop: 4,
    color: COLORS.textSecondary,
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },

  actionButton: {
    width: "31%",
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },

  actionIcon: {
    fontSize: 23,
  },

  actionText: {
    marginTop: 7,
    fontWeight: "600",
    color: COLORS.text,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 30,
    marginBottom: 18,
    color: COLORS.text,
  },

  timeline: {
    flexDirection: "row",
    marginBottom: 15,
  },

  timeContainer: {
    width: 80,
    alignItems: "center",
  },

  time: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginTop: 10,
  },

  timelineCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 14,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  itemType: {
    marginTop: 5,
    color: COLORS.textSecondary,
  },

  addPlaceButton: {
    marginTop: 15,
    marginBottom: 40,
    padding: 17,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
  },

  addPlaceText: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});