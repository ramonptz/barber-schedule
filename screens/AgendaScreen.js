import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AgendaScreen = ({ route }) => {
    const { bookings } = route.params;
    const [selectedDate, setSelectedDate] = useState('');
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [savedBookings, setSavedBookings] = useState({});

    // Função para salvar no AsyncStorage
    const saveBookings = async (data) => {
        try {
            await AsyncStorage.setItem('bookings', JSON.stringify(data));
        } catch (error) {
            console.error('Erro ao salvar os agendamentos:', error);
        }
    };

    // Função para carregar os agendamentos salvos
    const loadBookings = async () => {
        try {
            const storedBookings = await AsyncStorage.getItem('bookings');
            if (storedBookings !== null) {
                setSavedBookings(JSON.parse(storedBookings));
            }
        } catch (error) {
            console.error('Erro ao carregar os agendamentos:', error);
        }
    };

    useEffect(() => {
        loadBookings(); // Carrega os agendamentos ao iniciar o app
    }, []);

    useEffect(() => {
        if (bookings) {
            setSavedBookings(bookings);
            saveBookings(bookings); // Salva os agendamentos sempre que houver mudanças
        }
    }, [bookings]);

    const renderItem = ({ item, index }) => (
        <View style={styles.bookingContainer}>
            <TouchableOpacity
                onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
                <View style={styles.bookingHeader}>
                    <Text style={styles.bookingText}>{item.name} - {item.slot} - {item.barber ? item.barber : 'Sem barbeiro'}</Text>
                    <Text style={styles.arrow}>{expandedIndex === index ? '▼' : '▲'}</Text>
                </View>
            </TouchableOpacity>
            {expandedIndex === index && (
                <View style={styles.expandedDetails}>
                    <Text>Serviços: {item.services}</Text>
                    <Text>Contato: {item.phone}</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text>Selecione uma data para ver a agenda:</Text>
            <Calendar
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                }}
                markedDates={Object.keys(savedBookings).reduce((acc, date) => {
                    acc[date] = { marked: true };
                    return acc;
                }, {})}
            />
            {selectedDate && (
                <>
                    <Text style={styles.selectedDateText}>
                        Agenda para {selectedDate}:
                    </Text>
                    <FlatList
                        data={savedBookings[selectedDate] ? Object.values(savedBookings[selectedDate]).flat() : []}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.flatList}
                    />
                </>
            )}
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
});

export default AgendaScreen;
