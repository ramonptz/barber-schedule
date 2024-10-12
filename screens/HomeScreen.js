import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const [bookings, setBookings] = useState({}); // Armazena as marcações
    const [loggedBarber, setLoggedBarber] = useState(null); // Armazena o barbeiro logado

    const handleLogout = () => {
        setLoggedBarber(null); // Limpa o barbeiro logado
    };

    const handleCancellationPress = () => {
        if (!loggedBarber) {
            Alert.alert('Atenção', 'Você precisa estar logado como barbeiro para desmarcar horários.');
            return;
        }
    
        // Navegar para a tela de cancelamento passando todas as reservas
        navigation.navigate('Cancellation', { bookings, setBookings });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Bem-vindo à BarberShop do Pedrinho!(Protótipo)</Text>

            {/* Exibe se é cliente ou barbeiro logado */}
            {loggedBarber ? (
                <Text style={styles.loggedUserText}>Logado como: {loggedBarber}</Text>
            ) : (
                <Text style={styles.loggedUserText}>Você é um cliente.</Text>
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('BarberSelection', { bookings, setBookings })}
            >
                <Text style={styles.buttonText}>Marcar Horário</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Agenda', { bookings })}
            >
                <Text style={styles.buttonText}>Ver Agenda</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={loggedBarber ? styles.button : styles.disabledButton}
                onPress={handleCancellationPress}
                disabled={!loggedBarber}
            >
                <Text style={styles.buttonText}>Desmarcar Horário</Text>
            </TouchableOpacity>

            {/* Botão de Logout se um barbeiro estiver logado */}
            {loggedBarber ? (
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            ) : (
                // Botão para Login do Barbeiro
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Login', { bookings, setBookings, setLoggedBarber })}
                >
                    <Text style={styles.buttonText}>Login do Barbeiro</Text>
                </TouchableOpacity>
            )}
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
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20, // Espaçamento abaixo do texto
        color: '#333', // Cor do texto
    },
    loggedUserText: {
        fontSize: 18,
        marginBottom: 20, // Espaçamento abaixo do texto
        color: '#555', // Cor do texto
    },
    button: {
        backgroundColor: '#4CAF50', // Cor de fundo do botão
        padding: 15,
        borderRadius: 5,
        width: '80%', // Largura do botão
        alignItems: 'center',
        marginVertical: 10, // Espaçamento vertical entre os botões
    },
    disabledButton: {
        backgroundColor: '#d3d3d3', // Cor de fundo do botão desabilitado
        padding: 15,
        borderRadius: 5,
        width: '80%', // Largura do botão
        alignItems: 'center',
        marginVertical: 10, // Espaçamento vertical entre os botões
    },
    loginButton: {
        backgroundColor: '#2196F3', // Cor de fundo do botão de login
        padding: 15,
        borderRadius: 5,
        width: '80%', // Largura do botão
        alignItems: 'center',
        marginVertical: 20, // Espaçamento vertical entre os botões
    },
    logoutButton: {
        backgroundColor: '#f44336', // Cor de fundo do botão de logout
        padding: 15,
        borderRadius: 5,
        width: '80%', // Largura do botão
        alignItems: 'center',
        marginVertical: 20, // Espaçamento vertical entre os botões
    },
    buttonText: {
        color: '#fff', // Cor do texto do botão
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
