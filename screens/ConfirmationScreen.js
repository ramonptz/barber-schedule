import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ConfirmationScreen = ({ route, navigation }) => {
    const { barber, slot, date, bookingDetails } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Confirmação de Agendamento</Text>
            <Text>Barbeiro: {barber}</Text>
            <Text>Data: {date}</Text>
            <Text>Horário: {slot}</Text>
            <Text>Nome do Cliente: {bookingDetails.name}</Text>
            <Text>Telefone: {bookingDetails.phone}</Text>
            <Text>Serviços: {bookingDetails.services}</Text>
            <Button title="Voltar à Home" onPress={() => navigation.navigate('Home')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default ConfirmationScreen;
