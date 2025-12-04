import React from 'react';


import StackNavigator from "./navigation/StackNavigator";
import {PaperProvider} from "react-native-paper";


export function App() {
    return (
        <>
            <PaperProvider>
                <StackNavigator></StackNavigator>
            </PaperProvider>
        </>
    );
}