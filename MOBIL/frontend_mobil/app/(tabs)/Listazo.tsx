import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { API_URL, SERVER_URL } from "../../api/config";
import { useCart } from "../../context/CartProvider";
import { router } from "expo-router";

type Termek = {
  termek_id: number;
  Név: string;
  "Ár(usd)": number;
  Típus: string;
  Szín: string;
  Méret: string;
  Státusz: string;
  Márka: string;
  kep_id: string;
};

type FilterOptionState = {
  sizes: { meretnev: string }[];
  colors: { szinnev: string }[];
  brands: { markanev: string }[];
};

type FilterState = {
  tipus: string;
  szin: string;
  meret: string;
  marka: string;
};

const apiUrl = API_URL;
const serverUrl = SERVER_URL;
const PAGE_SIZE = 16;

const ListazoInfinite = () => {
  const [data, setData] = useState<Termek[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<any>(null);  
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState<FilterState>({
    tipus: "",
    szin: "",
    meret: "",
    marka: "",
  });

  const [tempFilters, setTempFilters] = useState<FilterState>({
    tipus: "",
    szin: "",
    meret: "",
    marka: "",
  });

  const [options, setOptions] = useState<FilterOptionState>({
    sizes: [],
    colors: [],
    brands: [],
  });

  const handleSearch = (text: string) => {
  setSearchQuery(text);

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  const timer = setTimeout(() => {
    searchProducts(text);
  }, 400); // 400ms delay

  setDebounceTimer(timer);
};

  const [showFilters, setShowFilters] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    loadPage(1, true);
  }, [filters]);

  const fetchFilters = async () => {
    try {
      setFilterLoading(true);

      const [sizesRes, colorsRes, brandsRes] = await Promise.all([
        fetch(`${API_URL}/filters/sizes`),
        fetch(`${API_URL}/filters/colors`),
        fetch(`${API_URL}/filters/brands`),
      ]);

      if (!sizesRes.ok || !colorsRes.ok || !brandsRes.ok) {
        throw new Error("Nem sikerült betölteni a szűrő adatokat.");
      }

      const sizes = await sizesRes.json();
      const colors = await colorsRes.json();
      const brands = await brandsRes.json();

      setOptions({
        sizes: Array.isArray(sizes) ? sizes : [],
        colors: Array.isArray(colors) ? colors : [],
        brands: Array.isArray(brands) ? brands : [],
      });
    } catch (err) {
      console.error("Szűrő betöltési hiba:", err);
    } finally {
      setFilterLoading(false);
    }
  };

  const searchProducts = async (query: string) => {
  if (!query.trim()) {
    setIsSearching(false);
    refreshList();
    return;
  }

  try {
    setLoading(true);
    setIsSearching(true);

    const url = `${apiUrl}/termekek/search?q=${query}`;
    console.log("KERESÉS:", url);

    const response = await fetch(url);
    const data = await response.json();

    setData(Array.isArray(data) ? data : []);
    setHasMore(false);
  } catch (err) {
    console.error("Keresési hiba:", err);
  } finally {
    setLoading(false);
  }
};

  const loadPage = async (pageNum: number, refresh = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        ...(filters.tipus ? { tipus: filters.tipus } : {}),
        ...(filters.szin ? { szin: filters.szin } : {}),
        ...(filters.meret ? { meret: filters.meret } : {}),
        ...(filters.marka ? { marka: filters.marka } : {}),
      });

      const url = `${apiUrl}/termekek/filter?${params.toString()}`;
      console.log("API kérés:", url);

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('HTTP hiba: ' + response.status);
      }

      const dataArr = await response.json();
      console.log("API válasz:", dataArr);

      const newData = Array.isArray(dataArr) ? dataArr : [];

      setHasMore(newData.length >= PAGE_SIZE);
      setData(prev => (refresh ? newData : [...prev, ...newData]));
      setPage(pageNum);
    } catch (err) {
      console.error("Fetch hiba:", err);
      setError("Nem érhető el a backend szerver.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadPage(page + 1);
    }
  };

  const refreshList = () => {
    setHasMore(true);
    loadPage(1, true);
  };

  const resetFilters = () => {
    const empty: FilterState = {
      tipus: "",
      szin: "",
      meret: "",
      marka: "",
    };

    setTempFilters(empty);
    setFilters(empty);
    setHasMore(true);
    setShowFilters(false);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setHasMore(true);
    setShowFilters(false);
  };

  if (error && data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshList}>
          <Text style={styles.retryButtonText}>Újrapróbálás</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Terméklista</Text>

    <View style={styles.searchContainer}>
  
  <Text style={styles.searchIcon}>🔍</Text>

  <TextInput
    placeholder="Keresés név vagy márka alapján..."
    placeholderTextColor="#aaa"
    value={searchQuery}
    onChangeText={handleSearch}
    style={styles.searchInput}
  />

  {searchQuery.length > 0 && (
    <TouchableOpacity
      onPress={() => {
        setSearchQuery("");
        setIsSearching(false);
        refreshList();
      }}
    >
      <Text style={styles.clearButton}>✖</Text>
    </TouchableOpacity>
  )}

</View>

      <TouchableOpacity
        style={styles.openFilterButton}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.openFilterText}>
          {showFilters ? "Szűrő bezárása" : "Szűrés"}
        </Text>
      </TouchableOpacity>

      {showFilters && (
  <View style={styles.filterPanel}>
    <ScrollView
      style={styles.filterScroll}
      contentContainerStyle={styles.filterScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.filterPanelTitle}>Szűrők</Text>

      {filterLoading ? (
        <ActivityIndicator size="small" color="#f5c542" style={{ marginVertical: 10 }} />
      ) : (
        <>
          <Text style={styles.filterTitle}>Típus</Text>
          <View style={styles.filterOptions}>
            {["póló", "pulóver", "nadrág", "rövidnadrág"].map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.optionButton,
                  tempFilters.tipus === t && styles.optionActive
                ]}
                onPress={() =>
                  setTempFilters(prev => ({
                    ...prev,
                    tipus: prev.tipus === t ? "" : t
                  }))
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    tempFilters.tipus === t && styles.optionTextActive
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterTitle}>Szín</Text>
          <View style={styles.filterOptions}>
            {options.colors.map((s) => (
              <TouchableOpacity
                key={s.szinnev}
                style={[
                  styles.optionButton,
                  tempFilters.szin === s.szinnev && styles.optionActive
                ]}
                onPress={() =>
                  setTempFilters(prev => ({
                    ...prev,
                    szin: prev.szin === s.szinnev ? "" : s.szinnev
                  }))
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    tempFilters.szin === s.szinnev && styles.optionTextActive
                  ]}
                >
                  {s.szinnev}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterTitle}>Méret</Text>
          <View style={styles.filterOptions}>
            {options.sizes.map((m) => (
              <TouchableOpacity
                key={m.meretnev}
                style={[
                  styles.optionButton,
                  tempFilters.meret === m.meretnev && styles.optionActive
                ]}
                onPress={() =>
                  setTempFilters(prev => ({
                    ...prev,
                    meret: prev.meret === m.meretnev ? "" : m.meretnev
                  }))
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    tempFilters.meret === m.meretnev && styles.optionTextActive
                  ]}
                >
                  {m.meretnev}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterTitle}>Márka</Text>
          <View style={styles.filterOptions}>
            {options.brands.map((b) => (
              <TouchableOpacity
                key={b.markanev}
                style={[
                  styles.optionButton,
                  tempFilters.marka === b.markanev && styles.optionActive
                ]}
                onPress={() =>
                  setTempFilters(prev => ({
                    ...prev,
                    marka: prev.marka === b.markanev ? "" : b.markanev
                  }))
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    tempFilters.marka === b.markanev && styles.optionTextActive
                  ]}
                >
                  {b.markanev}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetText}>Törlés</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyText}>Alkalmaz</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  </View>
)}

      <FlatList
        data={data}
        keyExtractor={(item) => item.termek_id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() =>
                router.push({
                  pathname: "/termek/[id]" as any,
                  params: { id: item.termek_id }
                })
              }
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: `${serverUrl}/images/image${item.termek_id}.png` }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.brand}>{item.Márka}</Text>

                <Text style={styles.title}>{item.Név}</Text>

                <Text style={styles.price}>
                  Ár: {item["Ár(usd)"]} USD
                </Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoBadge}>Méret: {item.Méret}</Text>
                  <Text style={styles.infoBadge}>Szín: {item.Szín}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>Típus: {item.Típus}</Text>
                  <Text style={styles.statusText}>{item.Státusz}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.cardBody}>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => {
                  console.log("Kosárba:", item.termek_id);
                  addToCart(item.termek_id, 1);
                }}
              >
                <Text style={styles.cartButtonText}>Kosárba</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={loading && page === 1}
        onRefresh={refreshList}
        ListFooterComponent={
          loading && page > 1 ? (
            <ActivityIndicator style={{ marginVertical: 20 }} size="large" color="#f5c542" />
          ) : !hasMore ? (
            <Text style={styles.endText}>Nincs több termék.</Text>
          ) : null
        }
      />
    </View>
  );
};

export default ListazoInfinite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },

  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
    padding: 24,
  },

  headerTitle: {
    fontSize: 28,
    color: '#f5c542',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
  },

  openFilterButton: {
    backgroundColor: "#f5c542",
    marginHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  openFilterText: {
    fontWeight: "bold",
    color: "#1b1f27",
    fontSize: 16,
  },

  filterPanel: {
  backgroundColor: "#1f2430",
  marginHorizontal: 12,
  marginBottom: 14,
  borderRadius: 16,
  maxHeight: 420,
},

filterScroll: {
  maxHeight: 420,
},

filterScrollContent: {
  padding: 14,
},

  filterPanelTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  filterTitle: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 8,
    marginTop: 10,
    fontWeight: "600",
  },

  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  optionButton: {
    backgroundColor: "#313847",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  optionActive: {
    backgroundColor: "#f5c542",
  },

  optionText: {
    color: "#ffffff",
    fontSize: 14,
  },

  optionTextActive: {
    color: "#1b1f27",
    fontWeight: "bold",
  },

  filterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    gap: 10,
  },

  resetButton: {
    flex: 1,
    backgroundColor: "#444b57",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  resetText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },

  applyButton: {
    flex: 1,
    backgroundColor: "#f5c542",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  applyText: {
    color: "#1b1f27",
    fontSize: 15,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: '#1f2430',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
  },

  imageWrapper: {
    backgroundColor: '#ffffff',
    padding: 14,
  },

  image: {
    width: '100%',
    height: 220,
  },

  cardBody: {
    padding: 14,
  },

  brand: {
    color: '#f5c542',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },

  title: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  price: {
    fontSize: 20,
    color: '#f5c542',
    fontWeight: 'bold',
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },

  infoBadge: {
    backgroundColor: '#313847',
    color: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 14,
  },

  metaRow: {
    marginBottom: 4,
    gap: 6,
  },

  metaText: {
    color: '#d5d8df',
    fontSize: 15,
  },

  statusText: {
    color: '#7CFC8A',
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  cartButton: {
    backgroundColor: '#f5c542',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  cartButtonText: {
    color: '#1b1f27',
    fontSize: 16,
    fontWeight: 'bold',
  },

  retryButton: {
    backgroundColor: '#f5c542',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  retryButtonText: {
    color: '#1b1f27',
    fontSize: 16,
    fontWeight: 'bold',
  },

  errorText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 14,
    textAlign: 'center',
  },

  endText: {
    textAlign: 'center',
    color: '#b8bcc8',
    marginVertical: 20,
    fontSize: 15,
  },

  searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#1f2430",
  margin: 10,
  paddingHorizontal: 12,
  borderRadius: 12,
},

searchIcon: {
  fontSize: 18,
  marginRight: 8,
  color: "#aaa",
},

searchInput: {
  flex: 1,
  color: "white",
  paddingVertical: 10,
  fontSize: 16,
},

clearButton: {
  fontSize: 18,
  color: "#aaa",
  padding: 4,
},
});