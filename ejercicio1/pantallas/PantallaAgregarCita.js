import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { guardarCitas, cargarCitas } from '../utilidades/almacenamiento';

const PantallaAgregarCita = ({ navigation, route }) => {
  const [clientName, setClientName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [date, setDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(Math.floor(new Date().getMinutes() / 15) * 15);
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeOptions, setTimeOptions] = useState([]);

  const getDayOfWeek = (selectedDate) => {
    const day = new Date(selectedDate).getDay();
    return day;
  };

  const generateTimeOptions = (selectedDate) => {
    const dayOfWeek = getDayOfWeek(selectedDate);
    const options = [];
    let startHour, endHour;

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      startHour = 8;
      endHour = 17;
    } else if (dayOfWeek === 6) {
      startHour = 8;
      endHour = 12;
    } else {
      return [{ label: 'Domingo - No se trabaja', value: null, disabled: true }];
    }

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
        const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
        options.push({ label: `${formattedHour}:${formattedMinute}`, value: { hour, minute } });
      }
    }
    return options;
  };

  useEffect(() => {
    if (route.params?.cita) {
      const cita = route.params.cita;
      setClientName(cita.clientName);
      setVehicleModel(cita.vehicleModel);
      setDate(new Date(cita.date));
      const [hour, minute] = cita.time.split(':');
      setSelectedHour(parseInt(hour));
      setSelectedMinute(parseInt(minute));
      setDescription(cita.description || '');
    }
    setTimeOptions(generateTimeOptions(date));
  }, [date, route.params]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setTimeOptions(generateTimeOptions(selectedDate));
      const firstValidOption = generateTimeOptions(selectedDate).find(opt => opt.value !== null);
      if (firstValidOption?.value) {
        setSelectedHour(firstValidOption.value.hour);
        setSelectedMinute(firstValidOption.value.minute);
      } else {
        setSelectedHour(0);
        setSelectedMinute(0);
      }
    }
  };

  const validateForm = () => {
    if (!clientName || !vehicleModel || !date) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return false;
    }
    if (clientName.length < 3) {
      Alert.alert('Error', 'El nombre del cliente debe tener al menos 3 caracteres.');
      return false;
    }
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(selectedHour);
    selectedDateTime.setMinutes(selectedMinute);

    if (selectedDateTime.getTime() <= Date.now()) {
      Alert.alert('Error', 'La fecha y hora deben ser posteriores al momento actual.');
      return false;
    }
    const dayOfWeek = getDayOfWeek(date);
    if (dayOfWeek === 0) {
      Alert.alert('Error', 'No se pueden agendar citas los domingos.');
      return false;
    }
    const isTimeValid = timeOptions.some(
      (option) => option.value?.hour === selectedHour && option.value?.minute === selectedMinute && !option.disabled
    );
    if (!isTimeValid) {
      Alert.alert('Error', 'Seleccione una hora válida dentro del horario laboral para el día.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formattedDate = new Date(date).toISOString().split('T')[0];
    const formattedTime = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;

    const newAppointment = {
      id: route.params?.cita?.id || Date.now().toString(), 
      clientName,
      vehicleModel,
      date: formattedDate,
      time: formattedTime,
      description,
    };

    const citas = await cargarCitas();

    const isDuplicate = citas.some(
      (cita) =>
        cita.id !== newAppointment.id && 
        cita.date === formattedDate &&
        cita.vehicleModel === vehicleModel &&
        cita.time === formattedTime
    );
    if (isDuplicate) {
      Alert.alert('Error', 'Ya existe una cita con la misma fecha, hora y vehículo.');
      return;
    }

    if (route.params?.cita) {
      const updatedCitas = citas.map((cita) =>
        cita.id === newAppointment.id ? newAppointment : cita
      );
      await guardarCitas(updatedCitas);
      Alert.alert('Éxito', 'Cita actualizada exitosamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      citas.push(newAppointment);
      await guardarCitas(citas);
      Alert.alert('Éxito', 'Cita guardada exitosamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const formatDateDisplay = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date(date).toLocaleDateString('es-ES', options);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del Cliente</Text>
      <TextInput value={clientName} onChangeText={setClientName} style={styles.input} />

      <Text style={styles.label}>Modelo del Vehículo</Text>
      <TextInput value={vehicleModel} onChangeText={setVehicleModel} style={styles.input} />

      <Text style={styles.label}>Fecha</Text>
      <Button title={formatDateDisplay(date)} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Hora</Text>
      <Picker
        selectedValue={{ hour: selectedHour, minute: selectedMinute }}
        style={styles.picker}
        onValueChange={(itemValue) => {
          if (itemValue) {
            setSelectedHour(itemValue.hour);
            setSelectedMinute(itemValue.minute);
          }
        }}
        enabled={timeOptions.some(opt => opt.value !== null)}
      >
        {timeOptions.map((option) => (
          <Picker.Item
            key={`${option.value?.hour}-${option.value?.minute}-${option.label}`}
            label={option.label}
            value={option.value}
            disabled={option.disabled}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Descripción </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.multilineInput]}
        multiline
      />

      <Button title={route.params?.cita ? 'Actualizar Cita' : 'Guardar Cita'} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC', 
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#4B5563', 
  },
  input: {
    height: 45,
    borderColor: '#E5E7EB', 
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  picker: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingLeft: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
});

export default PantallaAgregarCita;
