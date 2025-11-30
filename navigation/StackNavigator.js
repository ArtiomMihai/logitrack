import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import MainPage from '../components/pages/MainPage';
import RegistrationPage from '../components/pages/RegisterPage';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main" >
                <Stack.Screen name="Main" component={MainPage} />
                <Stack.Screen name="Registration" component={RegistrationPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
