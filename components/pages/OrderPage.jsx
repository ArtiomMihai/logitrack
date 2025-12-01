import { Text, StyleSheet, ScrollView } from "react-native";
import NewOrder from "../orders/NewOrder";

export default function OrderPage() {

    const orders = [
        { id: 1, address: "ул. Штефан чел Маре 15", createdBy: "Никита Михай", shop: "Linela", date: "01.12.2025", positions: 50, price: 9000 },
        { id: 2, address: "ул. Индепенденцей 2", createdBy: "Артём", shop: "Fidesco", date: "02.12.2025", positions: 40, price: 7800 },
        { id: 3, address: "ул. Козонакулуй 10", createdBy: "Никита", shop: "Nr.1", date: "29.11.2025", positions: 32, price: 6500 },
        { id: 4, address: "ул. Московская 44", createdBy: "Артём", shop: "Linella", date: "25.11.2025", positions: 22, price: 4100 },
        { id: 5, address: "ул. Иона Крянгэ 12", createdBy: "Мария", shop: "Fourchette", date: "21.11.2025", positions: 17, price: 3900 },
        { id: 6, address: "ул. Дечебал 3", createdBy: "Никита", shop: "Metro", date: "18.11.2025", positions: 95, price: 21000 },
        { id: 7, address: "ул. Бендер 8", createdBy: "Артём", shop: "Kaufland", date: "17.11.2025", positions: 12, price: 1800 },
        { id: 8, address: "ул. Аэродромулуй 14", createdBy: "Никита", shop: "Green Hills", date: "10.11.2025", positions: 28, price: 5200 },
        { id: 9, address: "ул. Григоре Виеру 30", createdBy: "Мария", shop: "ProStore", date: "08.11.2025", positions: 7, price: 620 },
        { id: 10, address: "ул. Лилиакулуй 5", createdBy: "Артём", shop: "Linela", date: "05.11.2025", positions: 65, price: 12000 },
        { id: 11, address: "ул. Изворулуй 61", createdBy: "Никита", shop: "Kaufland", date: "01.11.2025", positions: 14, price: 2400 },
        { id: 12, address: "ул. Болгарская 70", createdBy: "Мария", shop: "Fidesco", date: "27.10.2025", positions: 38, price: 7600 },
        { id: 13, address: "ул. Садовая 21", createdBy: "Никита", shop: "Nr.1", date: "20.10.2025", positions: 24, price: 4800 },
        { id: 14, address: "ул. Винулуй 8", createdBy: "Артём", shop: "Metro", date: "15.10.2025", positions: 56, price: 15000 },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.header}>Страница заказов</Text>

            {orders.map(order => (
                <NewOrder
                    key={order.id}
                    address={order.address}
                    createdBy={order.createdBy}
                    shop={order.shop}
                    date={order.date}
                    positions={order.positions}
                    price={order.price}
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
