import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CancellationScreen = ({ route }) => {
    const { bookings, setBookings } = route.params; // Recebe as marcações e o setter
    const [selectedDate, setSelectedDate] = useState(''); // Armazena a data selecionada
    const [expandedIndex, setExpandedIndex] = useState(null); // Para expandir/contrair os detalhes da reserva
    const [modalVisible, setModalVisible] = useState(false); // Controla a visibilidade do modal
    const [selectedBooking, setSelectedBooking] = useState(null); // Armazena a reserva selecionada para desmarcar

    // Marcar as datas com reservas no calendário
    const markedDates = Object.keys(bookings).reduce((acc, date) => {
        acc[date] = { marked: true };
        return acc;
    }, {});

    // Função para confirmar a desmarcação
    const handleCancelBooking = () => {
        if (selectedBooking) {
            const updatedBookings = { ...bookings };
            // Remove a reserva selecionada
            updatedBookings[selectedDate] = updatedBookings[selectedDate].filter(
                (booking) => booking.slot !== selectedBooking.slot
            );

            // Atualiza as marcações
            setBookings(updatedBookings);
            setModalVisible(false);
            Alert.alert('Reserva cancelada', 'A reserva foi cancelada com sucesso.');
        }
    };

    // Função que renderiza cada item da lista de reservas
    const renderItem = ({ item, index }) => (
        <View style={styles.bookingContainer}>
            <TouchableOpacity
                onPress={() => setExpandedIndex(expandedIndex === index ? null : index)} // Expande/contrai a reserva
            >
                <View style={styles.bookingHeader}>
                    <Text style={styles.bookingText}>{item.name} - {item.slot} - {item.barber ? item.barber : 'Sem barbeiro'}</Text>
                    <Text style={styles.arrow}>{expandedIndex === index ? '▼' : '▲'}</Text>
                </View>
            </TouchableOpacity>
            {expandedIndex === index && (
                <View style={styles.expandedDetails}>
                    <Text>Serviços: {Array.isArray(item.services) ? item.services.join(', ') : 'Nenhum serviço informado'}</Text>
                    <Text>Contato: {item.phone}</Text>
                    <Button title="Desmarcar" onPress={() => {
                        setSelectedBooking(item); // Armazena a reserva selecionada
                        setModalVisible(true); // Abre o modal
                    }} />
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text>Selecione uma data para ver as reservas:</Text>
            {/* Calendário para selecionar a data */}
            <Calendar
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                }}
                markedDates={markedDates}
            />

            {/* Mostra a lista de reservas da data selecionada */}
            {selectedDate && (
                <>
                    <Text style={styles.selectedDateText}>
                        Reservas para {selectedDate}:
                    </Text>
                    <FlatList
                        data={bookings[selectedDate] ? Object.values(bookings[selectedDate]).flat() : []}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.flatList}
                    />
                </>
            )}

            {/* Modal para confirmação da desmarcação */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)} // Fecha o modal
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Tem certeza que deseja cancelar esta reserva?</Text>
                        <Text>Cliente: {selectedBooking?.name}</Text>
                        <Text>Horário: {selectedBooking?.slot}</Text>
                        <View style={styles.modalButtons}>
                            <Button title="Sim" onPress={handleCancelBooking} />
                            <Button title="Não" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    selectedDateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    bookingContainer: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 5,
        marginVertical: 5,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bookingText: {
        fontSize: 16,
    },
    arrow: {
        fontSize: 18,
    },
    expandedDetails: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#e9e9e9',
        borderRadius: 5,
    },
    flatList: {
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
});

export default CancellationScreen;
