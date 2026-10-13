
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { destinations } from '../../data/destinations';
import { getData, saveData } from '../../services/storageService';

const STORAGE_KEY = 'smarttrip_favorites';

export default function FavoritesScreen() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getData(STORAGE_KEY).then((data) => {
        if (active) {
          setFavoriteIds(Array.isArray(data) ? data : []);
        }
      });

      return () => {
        active = false;
      };
    }, [])
  );

  const favorites = destinations.filter((place) =>
    favoriteIds.includes(place.id)
  );

  const removeFavorite = async (id: string) => {
    const next = favoriteIds.filter((item) => item !== id);
    setFavoriteIds(next);
    await saveData(STORAGE_KEY, next);
  };

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.eyebrow}>YOUR PERSONAL COLLECTION</Text>
      <Text style={s.title}>Saved Places</Text>
      <Text style={s.subtitle}>
        Keep your favorite destinations ready for your next adventure.
      </Text>

      <View style={s.summary}>
        <Text style={s.summaryEmoji}>♥</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.summaryTitle}>Your travel wishlist</Text>
          <Text style={s.summaryText}>
            {favorites.length} saved {favorites.length === 1 ? 'place' : 'places'}
          </Text>
        </View>
      </View>

      {favorites.map((place) => (
        <View key={place.id} style={s.card}>
          <View style={s.emojiBox}>
            <Text style={s.emoji}>{place.emoji}</Text>
          </View>

          <View style={s.cardBody}>
            <Text style={s.name}>{place.name}</Text>
            <Text style={s.description}>{place.description}</Text>
            <Text style={s.meta}>
              ★ {place.rating.toFixed(1)}  ·  {place.category}  ·  {place.budget}
            </Text>
          </View>

          <Pressable
            style={s.removeButton}
            onPress={() => void removeFavorite(place.id)}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${place.name} from favorites`}
          >
            <Text style={s.removeText}>♥</Text>
          </Pressable>
        </View>
      ))}

      {favorites.length === 0 && (
        <View style={s.empty}>
          <View style={s.emptyIcon}>
            <Text style={s.emptyEmoji}>♡</Text>
          </View>
          <Text style={s.emptyTitle}>Nothing saved yet</Text>
          <Text style={s.emptyText}>
            When you find a destination you love, tap its heart in Explore.
            It will appear here automatically.
          </Text>
          <Pressable
            style={s.button}
            onPress={() => router.push('/tabs/explore')}
          >
            <Text style={s.buttonText}>Explore destinations →</Text>
          </Pressable>
        </View>
      )}

      <Text style={s.footnote}>
        Your favorites are stored on this device.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F8F6' },
  content: { padding: 20, paddingBottom: 40 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#168477', marginBottom: 8 },
  title: { fontSize: 30, fontWeight: '800', color: '#20352F' },
  subtitle: { color: '#748078', lineHeight: 22, fontSize: 14, marginTop: 8 },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#E5F2EC', borderRadius: 18, padding: 18, marginTop: 24, marginBottom: 18 },
  summaryEmoji: { fontSize: 27, color: '#176B60' },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: '#20352F' },
  summaryText: { fontSize: 12, color: '#63766A', marginTop: 4 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 13, borderRadius: 17, borderWidth: 1, borderColor: '#E5ECE7', marginBottom: 12, gap: 12 },
  emojiBox: { width: 65, height: 70, borderRadius: 14, backgroundColor: '#EAF3EE', alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 34 },
  cardBody: { flex: 1 },
  name: { fontSize: 16, fontWeight: '800', color: '#20352F' },
  description: { fontSize: 12, color: '#748078', lineHeight: 18, marginTop: 5 },
  meta: { fontSize: 11, color: '#176B60', fontWeight: '700', marginTop: 8 },
  removeButton: { padding: 9 },
  removeText: { color: '#E34F65', fontSize: 23 },
  empty: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 25, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#E5ECE7' },
  emptyIcon: { width: 76, height: 76, borderRadius: 25, backgroundColor: '#E5F2EC', alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 44, color: '#176B60' },
  emptyTitle: { fontSize: 19, fontWeight: '800', color: '#20352F', marginTop: 18 },
  emptyText: { fontSize: 13, color: '#748078', textAlign: 'center', lineHeight: 22, marginTop: 9 },
  button: { backgroundColor: '#176B60', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 13, marginTop: 22 },
  buttonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  footnote: { fontSize: 11, color: '#89948D', textAlign: 'center', marginTop: 22 },
});
