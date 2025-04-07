import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { cargarCitas, eliminarCita } from '../utilidades/almacenamiento';

const { width, height } = Dimensions.get('window');
const isPortrait = height > width;

const PantallaInicio = () => {
  const navigation = useNavigation();
  const [citas, setCitas] = useState([]);
  const [numColumns, setNumColumns] = useState(isPortrait ? 1 : 2);

  const cargarYActualizarCitas = async () => {
    const citasGuardadas = await cargarCitas();
    setCitas(citasGuardadas);
  };

  useFocusEffect(
    useCallback(() => {
      cargarYActualizarCitas();
    }, [])
  );

  useEffect(() => {
    const onOrientationChange = () => {
      const { width, height } = Dimensions.get('window');
      setNumColumns(height > width ? 1 : 2);
    };

    const subscription = Dimensions.addEventListener('change', onOrientationChange);
    return () => subscription.remove();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            const citasFiltradas = citas.filter((cita) => cita.id !== id);
            await eliminarCita(citasFiltradas);
            setCitas(citasFiltradas);
            Alert.alert('Éxito', 'Cita eliminada');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PantallaEditarCita', { cita: item, onCitaActualizada: cargarYActualizarCitas })}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.clientName}</Text>
        <Text style={styles.cardText}>{item.vehicleModel}</Text>
        <Text style={styles.cardText}>{item.date} - {item.time}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={(event) => { event.stopPropagation(); navigation.navigate('PantallaEditarCita', { cita: item, onCitaActualizada: cargarYActualizarCitas }); }} style={styles.editButton}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('PantallaAgregarCita', { onNuevaCitaGuardada: cargarYActualizarCitas })} style={styles.addButton}>
        <Text style={styles.addButtonText}>Agregar Cita</Text>
      </TouchableOpacity>

      <FlatList
        key={numColumns}
        data={citas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={numColumns === 2 ? styles.columnWrapper : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9',
  },
  addButton: {
    backgroundColor: '#3B82F6', 
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 25,
    alignSelf: 'center',
    elevation: 4, 
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flex: 1,
    marginHorizontal: 10,
    elevation: 5, 
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#10B981', 
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    elevation: 3, 
  },
  deleteButton: {
    backgroundColor: '#EF4444', 
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default PantallaInicio;
