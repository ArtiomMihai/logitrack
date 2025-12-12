import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import MainPage from '../components/pages/MainPage';
import RegistrationPage from '../components/pages/RegisterPage';
import LoginPage from "../components/pages/LoginPage";
import OrderPage from "../components/pages/OrderPage";
import ShopPage from "../components/pages/ShopPage";
import PersonalProfile from "../components/pages/PersonalProfile";
import {CityPage} from "../components/pages/CityPage";
import OrderDetails from "../components/orders/OrderDetails";
import ProductsPage from "../components/pages/ProductsPage";
import CreateOrder from "../components/pages/CreateOrder";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
                <Stack.Screen name="Main" component={MainPage}/>
                <Stack.Screen name="Registration" component={RegistrationPage}/>
                <Stack.Screen name="Login" component={LoginPage}/>
                <Stack.Screen name="Order" component={OrderPage}/>
                <Stack.Screen name="Shops" component={ShopPage}/>
                <Stack.Screen name="Me" component={PersonalProfile}/>
                <Stack.Screen name="City" component={CityPage}/>
                <Stack.Screen name="Products" component={ProductsPage}/>
                <Stack.Screen
                    name="OrderDetails"
                    component={OrderDetails}
                    options={{ title: 'Детали заказа' }}
                />
                <Stack.Screen name="Orderses" component={CreateOrder}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
