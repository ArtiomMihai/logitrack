import { View, Text, StyleSheet, ScrollView } from "react-native";
import Order from "../orders/Order"; // путь к твоему компоненту Order

export default function OrderPage() {
    // Пример данных
    const orders = [
        { shopName: "Магазин А", generalPrice: "1200 ₽", positions: 3 },
        { shopName: "Магазин Б", generalPrice: "850 ₽", positions: 2 },
        { shopName: "Магазин В", generalPrice: "2300 ₽", positions: 5 },
        { shopName: "Магазин Г", generalPrice: "540 ₽", positions: 1 },
        { shopName: "Магазин Д", generalPrice: "1780 ₽", positions: 4 },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.header}>Страница заказов</Text>
            {orders.map((order, index) => (
                <Order
                    key={index}
                    shopName={order.shopName}
                    generalPrice={order.generalPrice}
                    positions={order.positions}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFEFEF",
    },
    content: {
        padding: 16,
        gap: 12,
        alignItems: "center",
    },
    header: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
    },
});
