import React, { useMemo, useState, useCallback } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/movieCard';
import useFetch from '@/services/useFetch';
import { fetchMovies } from '@/services/api';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';

// tiny debounce hook
function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 350);

  // fetcher uses the debounced query:
  // '' => default list (discover), text => real search
  const fetcher = useCallback(() => {
    const q = debouncedQuery.trim();
    return fetchMovies({ query: q });
  }, [debouncedQuery]);

  const { data: movies = [], loading, error } = useFetch(fetcher, true);

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
