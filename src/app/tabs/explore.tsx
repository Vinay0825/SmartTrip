
import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { destinations } from '../../data/destinations';
import { getData, saveData } from '../../services/storageService';

const STORAGE_KEY = 'smarttrip_favorites';
const categories = ['All', 'Beach', 'Nature', 'Culture', 'City', 'Adventure'];

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
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

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return destinations.filter((place) => {
      const matchesCategory =
        category === 'All' || place.category === category;

      const matchesSearch =
        `${place.name} ${place.description} ${place.category}`
          .toLowerCase()
          .includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [query, category]);

  const toggleFavorite = async (id: string) => {
    const next = favoriteIds.includes(id)
      ? favoriteIds.filter((item) => item !== id)
      : [...favoriteIds, id];

    setFavoriteIds(next);
    await saveData(STORAGE_KEY, next);
  };

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.eyebrow}>YOUR NEXT ADVENTURE</Text>
          <Text style={s.title}>Explore</Text>
          <Text style={s.subtitle}>
            Discover places worth travelling for.
          </Text>
        </View>
        <View style={s.countBubble}>
          <Text style={s.countEmoji}>✈️</Text>
        </View>
      </View>

      <View style={s.searchBox}>
        <Text style={s.searchIcon}>⌕</Text>
        <TextInput
          style={s.search}
          placeholder="Search destinations..."
          placeholderTextColor="#8A9891"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          accessibilityLabel="Search destinations"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Text style={s.clear}>✕</Text>
          </Pressable>
        )}
      </View>

      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Discover places</Text>
        <Text style={s.muted}>{destinations.length} places</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filters}
      >
        {categories.map((item) => {
          const active = category === item;

          return (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[s.chip, active && s.activeChip]}
            >
              <Text style={[s.chipText, active && s.activeChipText]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={s.resultText}>
        {filtered.length} {filtered.length === 1 ? 'destination' : 'destinations'} found
      </Text>

      {filtered.map((place) => {
        const saved = favoriteIds.includes(place.id);

        return (
          <View key={place.id} style={s.card}>
            <View style={s.cardTop}>
              <View style={s.emojiBox}>
                <Text style={s.emoji}>{place.emoji}</Text>
              </View>

              <Pressable
                onPress={() => void toggleFavorite(place.id)}
                style={s.heartButton}
                accessibilityRole="button"
                accessibilityLabel={
                  saved
                    ? `Remove ${place.name} from favorites`
                    : `Add ${place.name} to favorites`
                }
              >
                <Text style={[s.heart, saved && s.heartActive]}>
                  {saved ? '♥' : '♡'}
                </Text>
              </Pressable>
            </View>

            <View style={s.cardBody}>
              <View style={s.nameRow}>
                <Text style={s.name}>{place.name}</Text>
                <Text style={s.rating}>★ {place.rating.toFixed(1)}</Text>
              </View>

              <Text style={s.description}>{place.description}</Text>

              <View style={s.cardFooter}>
                <View style={s.categoryBadge}>
                  <Text style={s.categoryText}>{place.category}</Text>
                </View>
                <Text style={s.budget}>{place.budget}</Text>
              </View>
            </View>
          </View>
        );
      })}

      {filtered.length === 0 && (
        <View style={s.empty}>
          <Text style={s.emptyEmoji}>🔎</Text>
          <Text style={s.emptyTitle}>No places found</Text>
          <Text style={s.emptyText}>
            Try another search or select a different category.
          </Text>
          <Pressable
            style={s.resetButton}
            onPress={() => {
              setQuery('');
              setCategory('All');
            }}
          >
            <Text style={s.resetText}>Clear filters</Text>
          </Pressable>
        </View>
      )}

      <Text style={s.footnote}>
        Ratings and destination details are sample data, not live travel information.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F8F6' },
  content: { padding: 20, paddingBottom: 40 },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#168477', marginBottom: 7 },
  title: { fontSize: 32, fontWeight: '800', color: '#20352F' },
  subtitle: { fontSize: 14, color: '#748078', marginTop: 6, lineHeight: 21 },
  countBubble: { width: 54, height: 54, borderRadius: 18, backgroundColor: '#E0F0EA', alignItems: 'center', justifyContent: 'center' },
  countEmoji: { fontSize: 27 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E9E3', borderRadius: 16, paddingHorizontal: 14, marginBottom: 25 },
  searchIcon: { fontSize: 25, color: '#176B60', marginRight: 9 },
  search: { flex: 1, paddingVertical: 15, fontSize: 14, color: '#20352F', outlineStyle: 'none' as any },
  clear: { color: '#697771', fontSize: 18, padding: 6 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#20352F' },
  muted: { fontSize: 12, color: '#7B8981' },
  filters: { paddingTop: 15, paddingBottom: 10, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#E8EFEB', borderRadius: 22 },
  activeChip: { backgroundColor: '#176B60' },
  chipText: { fontSize: 12, fontWeight: '700', color: '#52655B' },
  activeChipText: { color: '#FFFFFF' },
  resultText: { fontSize: 12, color: '#7B8981', marginTop: 8, marginBottom: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#E5ECE7', overflow: 'hidden' },
  cardTop: { backgroundColor: '#EAF3EE', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  emojiBox: { width: 66, height: 66, borderRadius: 19, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 38 },
  heartButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  heart: { fontSize: 25, color: '#718078' },
  heartActive: { color: '#E34F65' },
  cardBody: { padding: 16 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  name: { fontSize: 19, fontWeight: '800', color: '#20352F', flex: 1 },
  rating: { color: '#9B6A12', fontWeight: '800', fontSize: 13 },
  description: { color: '#748078', fontSize: 13, lineHeight: 20, marginTop: 8 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 },
  categoryBadge: { backgroundColor: '#E8F4EF', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 9 },
  categoryText: { color: '#176B60', fontSize: 11, fontWeight: '800' },
  budget: { fontSize: 13, color: '#63736A', fontWeight: '700' },
  empty: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 26, alignItems: 'center', marginTop: 15 },
  emptyEmoji: { fontSize: 35 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#20352F', marginTop: 12 },
  emptyText: { color: '#748078', textAlign: 'center', lineHeight: 21, marginTop: 8 },
  resetButton: { backgroundColor: '#176B60', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, marginTop: 18 },
  resetText: { color: '#FFFFFF', fontWeight: '800' },
  footnote: { fontSize: 11, lineHeight: 17, color: '#89948D', marginTop: 8 },
});
