// MovieScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing
} from 'react-native';

const MovieScreen = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Loading animations start karen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      })
    ]).start();

    // Data fetch with delay
    setTimeout(() => {
      fetchMovieData();
    }, 2000);
  }, []);

  const fetchMovieData = async () => {
    try {
      console.log('Fetching movies data...');
      const response = await fetch('https://reactnative.dev/movies.json');
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Data received:', data.movies.length, 'movies');
      setMovies(data.movies);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };

  // Loading Screen Component - RED THEME
  const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <StatusBar backgroundColor="#991b1b" barStyle="light-content" />
      <Animated.View 
        style={[
          styles.loadingContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <View style={styles.pulsingCircle} />
        </View>
        <Text style={styles.loadingTitle}>🎭 CineVerse</Text>
        <Text style={styles.loadingSubtitle}>
          Preparing your cinematic journey...
        </Text>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </Animated.View>
    </View>
  );

  // Movie Item Component
  const MovieItem = ({ item, index }) => {
    const progressWidth = Math.random() * 60 + 40;

    return (
      <Animated.View 
        style={[
          styles.movieCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.movieHeader}>
            <View style={styles.movieNumberContainer}>
              <Text style={styles.movieNumber}>#{String(index + 1).padStart(2, '0')}</Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>🔥 {Math.random() > 0.5 ? '8.7' : '8.9'}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.movieFooter}>
            <View style={styles.yearContainer}>
              <Text style={styles.yearLabel}>RELEASE YEAR</Text>
              <Text style={styles.movieYear}>{item.releaseYear}</Text>
            </View>
            <View style={styles.genreTag}>
              <Text style={styles.genreText}>PREMIUM</Text>
            </View>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressWidth}%` }]} />
          </View>
        </View>
      </Animated.View>
    );
  };

  // Header Component - RED THEME
  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>🎬 Film Vault</Text>
        <Text style={styles.headerSubtitle}>
          {movies.length} Exclusive Picks • Curated Collection
        </Text>
      </View>
      <View style={styles.headerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{movies.length}</Text>
          <Text style={styles.statLabel}>Films</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4.9</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    </View>
  );

  // List Header Component
  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderTitle}>Premium Selection</Text>
      <Text style={styles.listHeaderSubtitle}>
        Expertly curated films for true cinephiles
      </Text>
    </View>
  );

  const keyExtractor = (item) => item.id;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#450a0a" barStyle="light-content" />
      
      <Header />
      
      <FlatList
        data={movies}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => <MovieItem item={item} index={index} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<ListHeader />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a09',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#991b1b',
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loaderContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  pulsingCircle: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },
  dot1: { 
    opacity: 0.6,
    transform: [{ scale: 0.8 }]
  },
  dot2: { 
    opacity: 0.8,
    transform: [{ scale: 0.9 }]
  },
  dot3: { 
    opacity: 1,
    transform: [{ scale: 1 }]
  },
  header: {
    backgroundColor: '#450a0a',
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  headerContent: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fecaca',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(254, 202, 202, 0.7)',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(220, 38, 38, 0.5)',
  },
  listContainer: {
    padding: 20,
    paddingTop: 30,
  },
  listHeader: {
    marginBottom: 25,
  },
  listHeaderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fecaca',
    marginBottom: 8,
  },
  listHeaderSubtitle: {
    fontSize: 16,
    color: '#a8a29e',
    fontWeight: '500',
  },
  movieCard: {
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: '#1c1917',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.1)',
  },
  cardContent: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#1c1917',
  },
  movieHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  movieNumberContainer: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 15,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  movieNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  titleContainer: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fef2f2',
    marginBottom: 8,
    lineHeight: 24,
  },
  ratingBadge: {
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fecaca',
  },
  movieFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  yearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#a8a29e',
    marginRight: 8,
    backgroundColor: '#292524',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    letterSpacing: 0.5,
  },
  movieYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  genreTag: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  genreText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#292524',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#dc2626',
    borderRadius: 2,
  },
});

export default MovieScreen;