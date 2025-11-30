import Header from "../Header";
import {StyleSheet, Text, View} from "react-native";
import Order from "../orders/Order";
import Menu from "../menu/Menu";
import OrderDetails from "../orders/OrderDetails";
import {useState} from "react";

export default function MainPage() {
    const [isOpen, setIsOpen] = useState(false);

    function toggleMenu() {
        setIsOpen(!isOpen);
    }

    return (
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
            <OrderDetails></OrderDetails>
        </View>
    )
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
    lastOrders: {
        textAlign: "center",
        marginVertical: 20,
        fontSize: 22,
    }
})
