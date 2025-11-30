import {View, Text} from "react-native";
import Header from "./components/Header";
import Menu from "./components/Menu";
import {useState} from "react";
import Order from "./components/Order";
import {StyleSheet} from "react-native";
import MenuList from "./components/MenuList";

export function App() {
    const [isOpen, setIsOpen] = useState(false);

    function toggleMenu() {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <View style={styles.container}>
                <Header toggleMenu={toggleMenu}/>
                <View>
                    <Text style={styles.lastOrders}> Последние заявки:</Text>
                    <View style={styles.orderList}>
                        <Order/>
                        <Order/>
                    </View>
                </View>
                <Menu isOpen={isOpen} toggleMenu={toggleMenu}/>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#EFEFEF",
        height: "100%",
    },
    orderList: {
        flexDirection: "column",
        gap: 20,
    },
    lastOrders:{
        textAlign: "center",
        marginVertical: 20,
        fontSize: 22,
    }
})
