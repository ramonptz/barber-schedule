import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import BarberSelectionScreen from './screens/BarberSelectionScreen';
import BookingScreen from './screens/BookingScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import AgendaScreen from './screens/AgendaScreen'; // Nova importação
import CancellationScreen from './screens/CancellationScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="index" component={HomeScreen} />
                <Stack.Screen name="BarberSelection" component={BarberSelectionScreen} />
                <Stack.Screen name="Booking" component={BookingScreen} />
                <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
                <Stack.Screen name="Agenda" component={AgendaScreen} /> 
                <Stack.Screen name="Cancellation" component={CancellationScreen} /> 
                <Stack.Screen name="Login" component={LoginScreen} /> 
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
