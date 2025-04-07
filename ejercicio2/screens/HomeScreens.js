import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const data = require('../data/platillos.json');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [numColumns, setNumColumns] = useState(1); 

  useEffect(() => {
    const onChange = ({ window: { width, height } }) => {
      setNumColumns(height > width ? 1 : 2);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, numColumns === 2 && styles.cardLandscape]}
      onPress={() => navigation.navigate('Detail', { platillo: item })}
    >
      <Image source={{ uri: item.photo }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>
          {item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        key={numColumns} 
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        columnWrapperStyle={numColumns === 2 && styles.row}
      />
    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');
const cardMarginHorizontal = 10;
const cardMarginVertical = 10;
const cardPadding = 10;
const imageWidth = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f4f4f4',
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: cardMarginHorizontal,
  },
  card: {
    marginBottom: cardMarginVertical,
    padding: cardPadding,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    alignItems: 'flex-start',
    width: screenWidth - 2 * cardMarginHorizontal, 
    flex: 1,
  },
  cardLandscape: {
    width: (screenWidth - 2 * cardMarginHorizontal - 15) / 2,
    marginHorizontal: cardMarginHorizontal,
  },
  image: {
    width: imageWidth,
    height: imageWidth,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'justify',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    flexShrink: 1,
  },
});

export default HomeScreen;