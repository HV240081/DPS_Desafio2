import AsyncStorage from '@react-native-async-storage/async-storage';

const guardarCitas = async (citas) => {
  try {
    await AsyncStorage.setItem('appointments', JSON.stringify(citas));
  } catch (error) {
    console.error('Error guardando citas', error);
  }
};

const cargarCitas = async () => {
  try {
    const citas = await AsyncStorage.getItem('appointments');
    return citas ? JSON.parse(citas) : [];
  } catch (error) {
    console.error('Error cargando citas', error);
    return [];
  }
};

const eliminarCita = async (id) => {
  try {
    const citas = await cargarCitas();
    const updatedCitas = citas.filter((cita) => cita.id !== id);
    await guardarCitas(updatedCitas);
  } catch (error) {
    console.error('Error eliminando cita', error);
  }
};

export { guardarCitas, cargarCitas, eliminarCita };
