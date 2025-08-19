import React from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/movieCard';
import useFetch from '@/services/useFetch';
import { fetchMovies } from '@/services/api';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';
import { updateSearchCount } from '@/services/appWrite';

// debounce helper
function useDebouncedValue<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 500);

  // TMDB fetcher uses the *debounced* query: '' => default list, text => search
  const fetcher = React.useCallback(() => {
    const q = debouncedQuery.trim();
    return fetchMovies({ query: q });
  }, [debouncedQuery]);

  const { data: movies = [], loading, error } = useFetch(fetcher, true);

  // 👇 Match the tutorial: whenever query changes (after debounce), log/update in Appwrite
  React.useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) return; // don't log empty searches

    // pass the first movie as context if available (tutorial shows movies[0])
    updateSearchCount(q, movies[0]).catch((e) =>
      console.log('updateSearchCount error:', e)
    );
  }, [debouncedQuery, movies]); // movies dep allows sending movies[0] when results arrive

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full h-full" resizeMode="cover" />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'center', gap: 16, marginVertical: 16 }}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search movies ..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {searchQuery.trim().length > 0 && (
              <Text className="text-xl text-white font-bold">
                Search Results for <Text className="text-accent">{searchQuery}</Text>
              </Text>
            )}

            {loading && <ActivityIndicator size="large" color="#fff" className="my-3" />}
            {error && <Text className="text-red-500 my-3">Error: {error.message}</Text>}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? <Text className="text-white mt-6">No movies found.</Text> : null
        }
      />
    </View>
  );
};

export default SearchScreen;
