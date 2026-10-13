
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import COLORS from "../constants/colors";
import { getCurrentLocation } from "../services/locationService";
import { saveReview as storeReview } from "../services/reviewService";

export default function AddReviewScreen({ route, navigation }) {
  const place = route.params?.place;

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [location, setLocation] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      const current = await getCurrentLocation();
      if (current) {
        setLocation(current);
      }
    } catch (error) {
      console.log("Location error:", error);
    }
  };

  const openCamera = async () => {
    try {
      if (!permission?.granted) {
        const result = await requestPermission();

        if (!result.granted) {
          Alert.alert(
            "Camera Permission",
            "Camera access is required to take a travel photo."
          );
          return;
        }
      }

      setCameraOpen(true);
    } catch (error) {
      console.error("Camera permission error:", error);
      Alert.alert("Error", "Unable to open the camera.");
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });

      if (result?.uri) {
        setPhoto(result.uri);
        setCameraOpen(false);
      }
    } catch (error) {
      console.error("Photo capture error:", error);
      Alert.alert("Error", "Unable to capture the photo.");
    }
  };

  const saveReview = async () => {
    if (saving) return;

    if (rating === 0) {
      Alert.alert("Add Rating", "Please select a rating.");
      return;
    }

    if (!review.trim()) {
      Alert.alert("Add Review", "Please write about your experience.");
      return;
    }

    setSaving(true);

    try {
      await storeReview({
        id: `${Date.now()}`,
        placeId: place?.id != null ? String(place.id) : null,
        placeName: place?.name || "Unknown Place",
        place: place || null,
        rating,
        review: review.trim(),
        photo: photo || null,
        location: location || null,
        date: new Date().toISOString(),
      });

      Alert.alert(
        "Review Saved",
        "Your travel experience has been saved.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Review save error:", error);
      Alert.alert(
        "Error",
        "Unable to save your review. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (cameraOpen) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
        />

        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePhoto}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelCamera}
            onPress={() => setCameraOpen(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Your Experience</Text>

      <Text style={styles.subtitle}>
        {place?.name || "Add your travel experience"}
      </Text>

      <Text style={styles.label}>Capture your experience</Text>

      {photo ? (
        <View>
          <Image
            source={{ uri: photo }}
            style={styles.preview}
          />

          <TouchableOpacity
            style={styles.retake}
            onPress={openCamera}
          >
            <Text style={styles.retakeText}>Retake Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.retake}
            onPress={() => setPhoto(null)}
          >
            <Text style={styles.removePhotoText}>Remove Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.cameraBox}
          onPress={openCamera}
        >
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.cameraText}>Take a Photo</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>Your Rating</Text>

      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            accessibilityLabel={`Rate ${star} out of 5 stars`}
          >
            <Text
              style={[
                styles.star,
                { opacity: star <= rating ? 1 : 0.25 },
              ]}
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.ratingText}>
        {rating === 0 ? "Tap to rate" : `${rating}/5`}
      </Text>

      <Text style={styles.label}>Your Review</Text>

      <TextInput
        style={styles.reviewInput}
        placeholder="What did you think about this place?"
        placeholderTextColor={COLORS.textSecondary}
        multiline
        textAlignVertical="top"
        value={review}
        onChangeText={setReview}
      />

      {location && (
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>
            📍 Location Captured
          </Text>

          <Text style={styles.locationText}>
            {typeof location.latitude === "number" &&
            typeof location.longitude === "number"
              ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
              : "Location available"}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.saveButton,
          saving && styles.saveButtonDisabled,
        ]}
        onPress={saveReview}
        disabled={saving}
      >
        <Text style={styles.saveText}>
          {saving ? "Saving..." : "Save Experience"}
        </Text>
      </TouchableOpacity>
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
    paddingBottom: 40,
  },
  title: {
    marginTop: 30,
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 5,
    color: COLORS.textSecondary,
  },
  label: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  cameraBox: {
    height: 220,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    fontSize: 45,
  },
  cameraText: {
    marginTop: 10,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    height: 250,
    borderRadius: 18,
  },
  retake: {
    alignItems: "center",
    padding: 10,
  },
  retakeText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  removePhotoText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  stars: {
    flexDirection: "row",
  },
  star: {
    fontSize: 40,
    color: COLORS.star,
    marginRight: 8,
  },
  ratingText: {
    color: COLORS.textSecondary,
  },
  reviewInput: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    minHeight: 130,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  locationCard: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 15,
  },
  locationTitle: {
    fontWeight: "700",
    color: COLORS.primary,
  },
  locationText: {
    marginTop: 5,
    color: COLORS.textSecondary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: COLORS.primary,
  },
  cancelCamera: {
    marginTop: 20,
  },
  cancelText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
