import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const BookingScreen = ({ route, navigation }) => {
  const { bookings, barberName } = route.params;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  // Geração de horários disponíveis
  const generateAvailableSlots = (date) => {
    const availableSlots = [];
    for (let hour = 8; hour < 16; hour++) {
      availableSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      availableSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    const bookedSlots = bookings[date]
        ? bookings[date]
              .filter(booking => booking.barber === barberName) // Apenas as marcações do barbeiro atual
              .map(booking => booking.slot)
        : [];

    return availableSlots.filter(slot => !bookedSlots.includes(slot));
  };

  const availableSlotsFiltered = selectedDate ? generateAvailableSlots(selectedDate) : [];


  const handlePhoneChange = (text) => {
    let formattedPhone = text.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (formattedPhone.length > 10) {
      formattedPhone = formattedPhone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1)$2-$3');
    } else if (formattedPhone.length > 6) {
      formattedPhone = formattedPhone.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1)$2-$3');
    } else if (formattedPhone.length > 2) {
      formattedPhone = formattedPhone.replace(/^(\d{2})(\d{0,5})$/, '($1)$2');
    }

    setPhone(formattedPhone);
  };

  // Função para lidar com a seleção de serviços
  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Função para lidar com a confirmação da marcação
  const confirmBooking = () => {
    if (!name || !phone || selectedServices.length === 0 || !selectedSlot) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos e selecione um serviço e horário.');
      return;
    }

    const newBooking = {
      name,
      slot: selectedSlot,
      barber: barberName,
      services: selectedServices.join(', '),
      phone,
    };

    bookings[selectedDate] = bookings[selectedDate] || [];
    bookings[selectedDate].push(newBooking);

    Alert.alert('Sucesso', 'Marcação realizada com sucesso!', [
      { text: 'OK', onPress: () => navigation.navigate('index', { bookings }) }, // Redireciona para a tela de agenda
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView>
        <Text style={styles.label}>Selecione a Data:</Text>
        <Calendar
          onDayPress={(day) => {
            const selected = day.dateString;
            setSelectedDate(selected);
            setSelectedSlot('');
            setModalVisible(true); // Abrir o modal ao selecionar a data
          }}
          minDate={new Date().toISOString().split('T')[0]} // Apenas dias a partir da data atual
          markingType={'multi-dot'}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, dotColor: 'red' },
          }}
        />

        {selectedDate ? (
          <Text style={styles.selectedDateText}>Data Selecionada: {selectedDate}</Text>
        ) : (
          <Text style={styles.noSlotsText}>Selecione uma data para ver os horários disponíveis.</Text>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)} // Fecha o modal ao clicar fora
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Horários Disponíveis</Text>
              <FlatList
                data={availableSlotsFiltered}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.slotButton,
                      selectedSlot === item && styles.selectedSlotButton, // Destacar o horário selecionado
                    ]}
                    onPress={() => {
                      setSelectedSlot(item);
                      setModalVisible(false); // Fecha o modal após selecionar o horário
                    }}
                  >
                    <Text style={styles.slotText}>{item}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.noSlotsText}>Nenhum horário disponível.</Text>}
              />
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {selectedSlot ? (
          <Text style={styles.selectedSlotText}>Horário Selecionado: {selectedSlot}</Text>
        ) : null}

        <Text style={styles.label}>Nome do Cliente:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome"
        />
        <Text style={styles.label}>Telefone para Contato:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={handlePhoneChange} // Usa a função de formatação
          placeholder="(DDD)99999-9999"
          keyboardType="phone-pad"
          maxLength={14} // Limitar a entrada a 14 caracteres para o formato de telefone
        />

        <Text style={styles.label}>Serviços:</Text>
        <View style={styles.serviceContainer}>
          {['Corte de cabelo', 'Barba', 'Luzes', 'Limpeza facial'].map((service) => (
            <TouchableOpacity
              key={service}
              style={[
                styles.serviceButton,
                selectedServices.includes(service) && styles.serviceButtonSelected,
              ]}
              onPress={() => toggleService(service)}
            >
              <Text style={styles.serviceText}>{service}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={confirmBooking} 
        >
          <Text style={styles.confirmButtonText}>Confirmar Marcação</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  serviceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  serviceButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1, // Borda leve
    borderColor: '#ccc', // Cor da borda antes de selecionar
},
  serviceButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  slotButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedSlotButton: {
    backgroundColor: '#4CAF50',
  },
  slotText: {
    textAlign: 'center',
    fontSize: 16,
  },
  selectedSlotText: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#4CAF50',
  },
  selectedDateText: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  noSlotsText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 10,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeModalButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeModalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default BookingScreen;
