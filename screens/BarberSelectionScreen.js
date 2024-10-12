import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BarberSelectionScreen = ({ navigation, route }) => {
    const { bookings, setBookings } = route.params;
    const barbers = ['pedrinho', 'junior', 'leandro'];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecione um Barbeiro:</Text>
            {barbers.map((barber, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => navigation.navigate('Booking', { barberName: barber, bookings, setBookings })}
                >
                    <Text style={styles.buttonText}>{barber}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Cor de fundo
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30, // Espaço abaixo do título
        color: '#333', // Cor do texto
    },
    button: {
        backgroundColor: '#4CAF50', // Cor de fundo do botão
        padding: 15,
        borderRadius: 5,
        width: '80%', // Largura do botão
        alignItems: 'center',
        marginVertical: 10, // Espaçamento entre os botões
    },
    buttonText: {
        color: '#fff', // Cor do texto do botão
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BarberSelectionScreen;
