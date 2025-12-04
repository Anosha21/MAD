import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const MotivationalQuotes = ({ navigation }) => {
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [apiBlocked, setApiBlocked] = useState(false);

  // ZenQuotes API se data fetch karne ka function with rate limiting
  const fetchQuotesFromAPI = async () => {
    // Rate limiting: Only allow one request every 10 seconds
    const currentTime = Date.now();
    const timeSinceLastFetch = currentTime - lastFetchTime;
    
    if (timeSinceLastFetch < 2000 && lastFetchTime !== 0) {
      Alert.alert(
        'Slow Down!',
        'Please wait 2 seconds before fetching another quote.',
        [{ text: 'OK' }]
      );
      setRefreshing(false);
      return;
    }

    // If API is blocked, use fallback quotes
    if (apiBlocked) {
      useFallbackQuotes();
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching quotes from API...');
      
      const response = await fetch('https://zenquotes.io/api/random');
      
      if (!response.ok) {
        if (response.status === 429) {
          // API rate limit exceeded
          setApiBlocked(true);
          throw new Error('API rate limit exceeded. Using offline quotes.');
        }
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data && data.length > 0) {
        const newQuote = {
          text: data[0].q,
          author: data[0].a
        };
        
        // New quote ko existing quotes ke start mein add karein
        setQuotes(prevQuotes => {
          const updatedQuotes = [newQuote, ...prevQuotes];
          // Maximum 15 quotes rakhein
          return updatedQuotes.slice(0, 5);
        });
        
        // Current quote ko 0 pe set karein (newest quote show hoga)
        setCurrentQuote(0);
        setLastFetchTime(Date.now());
      } else {
        throw new Error('No quotes received from API');
      }
      
    } catch (error) {
      console.error('API Fetch Error:', error);
      
      if (error.message.includes('rate limit')) {
        Alert.alert(
          'API Limit Reached',
          'You have reached the daily quotes limit. you can only use 5 quotes a day. Use offline inspirational quotes.     Thankyou😊',
          [{ text: 'OK' }]
        );
        useFallbackQuotes();
      } else {
        // Network error or other issues
        Alert.alert(
          'Connection Issue',
          'Using offline quotes. Check your internet connection for live quotes.',
          [{ text: 'OK' }]
        );
        useFallbackQuotes();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fallback quotes function
  const useFallbackQuotes = () => {
    const fallbackQuotes = [
      {
        text: "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela"
      },
      {
        text: "The beautiful thing about learning is that no one can take it away from you.",
        author: "B.B. King"
      },
      {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
      },
      {
        text: "Your education is a dress rehearsal for a life that is yours to lead.",
        author: "Nora Ephron"
      },
      {
        text: "The mind is not a vessel to be filled, but a fire to be kindled.",
        author: "Plutarch"
      },
      {
        text: "Don't let what you cannot do interfere with what you can do.",
        author: "John Wooden"
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
      },
      {
        text: "You are never too old to set another goal or to dream a new dream.",
        author: "C.S. Lewis"
      },
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
      },
      {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
      }
    ];
    
    setQuotes(prevQuotes => {
      // Only add fallback quotes if we don't have any
      if (prevQuotes.length === 0) {
        return fallbackQuotes;
      }
      return prevQuotes;
    });
    setCurrentQuote(0);
  };

  // Component load hote hi quotes fetch karein
  useEffect(() => {
    fetchQuotesFromAPI();
  }, []);

  const nextQuote = () => {
    if (quotes.length > 1) {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }
  };

  const previousQuote = () => {
    if (quotes.length > 1) {
      setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
    }
  };

  // Refresh quotes manually
  const refreshQuotes = () => {
    setRefreshing(true);
    fetchQuotesFromAPI();
  };

  // Get current status message
  const getStatusMessage = () => {
    if (apiBlocked) {
      return '📚 Using Offline Quotes';
    }
    if (quotes.length > 0 && quotes[0].text.includes("Education")) {
      return '📚 Offline Inspirational Quotes';
    }
    return '📡 Live from ZenQuotes API';
  };

  // Agar quotes nahi hain to loading show karein
  if (loading && quotes.length === 0) {
    return (
      <View style={styles.fullScreenContainer}>
        <LinearGradient
          colors={['#3784b4ff', '#82cbebff', '#f5baa2ff']}
          start={{ x: 0.02, y: 0.02 }}
          end={{ x: 0.02, y: 0.8 }}
          style={styles.gradientBackground}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0e456fff" />
          <Text style={styles.loadingText}>Loading inspirational quotes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar backgroundColor="#87CEEB" barStyle="dark-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#1c6ea0ff', '#6cb5d4ff', '#fc9b90ff']}
        start={{ x: 0.02, y: 0.02 }}
        end={{ x: 0.02, y: 0.8 }}
        style={styles.gradientBackground}
      />

      {/* Subtle Educational Background Image */}
      <Image
        source={{ uri: 'https://media.istockphoto.com/id/1218737747/vector/learning-online-e-learning-video-call-chat-with-class-distance-education.jpg?s=612x612&w=0&k=20&c=fFFwc3CTP4XtvmruZLiK8EzAbzvAxJL_kw5BsA7z7w8=' }}
        style={styles.educationImage}
        resizeMode="cover"
      />

      {/* Back Button - ADDED THIS */}
      <TouchableOpacity style={styles.backArrowButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrowButtonText}>←</Text>
      </TouchableOpacity>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <Image 
          source={{ uri: 'https://jrcrs.riphah.edu.pk/wp-content/uploads/2017/05/RIU-logo.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Screen Title */}
        <Text style={styles.sectionTitle}>Motivational Quotes</Text>

        {/* Status Indicator */}
        <View style={[styles.statusIndicator, apiBlocked && styles.statusIndicatorOffline]}>
          <Text style={styles.statusText}>
            {apiBlocked ? '🔒 Offline Mode' : '🌐 Online Mode'}
          </Text>
        </View>

        {/* Refresh Button */}
        <TouchableOpacity 
          style={[styles.refreshButton, apiBlocked && styles.refreshButtonDisabled]}
          onPress={refreshQuotes}
          disabled={refreshing || apiBlocked}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.refreshButtonText}>
              {apiBlocked ? '📚 Offline Mode' : '🔄 Refresh Quotes'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Quote Card */}
        <View style={styles.quoteCard}>
          {refreshing ? (
            <View style={styles.quoteLoading}>
              <ActivityIndicator size="large" color="#0e456fff" />
              <Text style={styles.quoteLoadingText}>Fetching new quote...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.quoteIcon}>💫</Text>
              <Text style={styles.quoteText}>
                "{quotes[currentQuote]?.text || 'No quote available'}"
              </Text>
              <Text style={styles.quoteAuthor}>
                — {quotes[currentQuote]?.author || 'Unknown'}
              </Text>
            </>
          )}
        </View>

        {/* Navigation and Progress */}
        <View style={styles.navigationContainer}>
          {/* Previous Button */}
          <TouchableOpacity 
            style={[styles.navButton, styles.prevButton]}
            onPress={previousQuote}
            disabled={quotes.length <= 1}
          >
            <Text style={styles.navButtonText}>⬅ Previous</Text>
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {quotes.length > 0 ? `${currentQuote + 1} / ${quotes.length}` : '0 / 0'}
            </Text>
            <Text style={styles.quoteSource}>
              {getStatusMessage()}
            </Text>
          </View>

          {/* Next Button */}
          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton]}
            onPress={nextQuote}
            disabled={quotes.length <= 1}
          >
            <Text style={styles.navButtonText}>Next ➡</Text>
          </TouchableOpacity>
        </View>

        {/* REMOVED: Tips Section with Live Quotes Feature */}
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#2589b1ff',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  educationImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    opacity: 0.12,
  },
  // ADDED: Back arrow button styles
  backArrowButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 25,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#0e456fff',
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e456fff',
    fontFamily: 'System',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.15,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0e456fff',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'System',
    textShadowColor: 'rgba(33, 118, 187, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statusIndicator: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 15,
  },
  statusIndicatorOffline: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  refreshButtonDisabled: {
    backgroundColor: '#f39292ff',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'System',
  },
  quoteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 30,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#f36868ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#fcb4b4ff',
    minHeight: 200,
    justifyContent: 'center',
  },
  quoteLoading: {
    alignItems: 'center',
  },
  quoteLoadingText: {
    marginTop: 10,
    color: '#0e456fff',
    fontSize: 14,
    fontStyle: 'italic',
  },
  quoteIcon: {
    fontSize: 40,
    marginBottom: 15,
  },
  quoteText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0e456fff',
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
    fontFamily: 'System',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    minWidth: 80,
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: '#0e456fff',
    borderWidth: 1,
    borderColor: '#0e456fff',
  },
  nextButton: {
    backgroundColor: '#0e456fff',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f3f5f7ff',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0e456fff',
    fontFamily: 'System',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 5,
  },
  quoteSource: {
    fontSize: 10,
    color: '#ff6b6b',
    fontWeight: '800',
    fontStyle: 'italic',
  },
  // REMOVED: tipsCard, tipsTitle, tipsText, and apiNote styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#0e456fff',
    fontWeight: '600',
  },
});

export default MotivationalQuotes;