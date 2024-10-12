import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation, route }) => {
    const { bookings, setBookings, setLoggedBarber } = route.params; // Receber bookings e setLoggedBarber da HomeScreen
    const [barberName, setBarberName] = useState('');
    const [password, setPassword] = useState('');

    const barbers = [
        { name: 'pedrinho', password: '123' },
        { name: 'junior', password: '123' },
        { name: 'leandro', password: '123' }
    ];

    const handleLogin = () => {
        const barber = barbers.find(b => b.name === barberName);
    
        if (!barber || barber.password !== password) {
            Alert.alert('Erro', 'Nome de barbeiro ou senha incorretos.');
            return;
        }
    
        // Setar o barbeiro logado corretamente
        setLoggedBarber(barberName);
    
        // Voltar para a tela inicial após login
        navigation.navigate('index', { barberName, bookings, setBookings });
    };

    return (
        <View style={styles.container}>
            <Text>Nome do Barbeiro:</Text>
            <TextInput 
                value={barberName} 
                onChangeText={setBarberName} 
                style={styles.input} 
            />

            <Text>Senha:</Text>
            <TextInput 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
                style={styles.input} 
            />

            <Button title="Entrar" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
});

export default LoginScreen;
