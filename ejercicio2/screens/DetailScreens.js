
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const DetailScreen = ({ route }) => {
  const { platillo } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: platillo.photo }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{platillo.name}</Text>
        <Text style={styles.price}>{platillo.price}</Text>
        <Text style={styles.descriptionTitle}>Descripción:</Text>
        <Text style={styles.description}>{platillo.description}</Text>
        <Text style={styles.ingredientsTitle}>Ingredientes:</Text>
        {platillo.ingredients && platillo.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>- {ingredient}</Text>
        ))}
        <Text style={styles.region}>Región: {platillo.region}</Text>
        <Text style={styles.category}>Categoría: {platillo.category}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  price: {
    fontSize: 18,
    color: '#007bff',
    marginBottom: 15,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 15,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  ingredient: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  region: {
    fontSize: 16,
    color: '#777',
    marginTop: 15,
  },
  category: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
});

export default DetailScreen;