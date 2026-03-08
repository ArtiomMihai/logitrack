import Header from "../Header";
import { Button, StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import Menu from "../menu/Menu";
import { useState, useRef } from "react";

const { width } = Dimensions.get('window');

// Моковые данные для заказов (4 заказа, цены в леях)
const orders = [
    {
        id: 1,
        title: 'Заказ #1',
        status: 'В обработке',
        price: '2 500 лей',
        date: '2024-01-15',
        quantity: 5
    },
    {
        id: 2,
        title: 'Заказ #2',
        status: 'Доставка',
        price: '3 800 лей',
        date: '2024-01-16',
        quantity: 12
    },
    {
        id: 3,
        title: 'Заказ #3',
        status: 'Выполнен',
        price: '1 200 лей',
        date: '2024-01-17',
        quantity: 3
    },
    {
        id: 4,
        title: 'Заказ #4',
        status: 'Отменен',
        price: '4 500 лей',
        date: '2024-01-18',
        quantity: 8
    },
];

// Компонент для отображения одного заказа
const OrderCard = ({ order }) => {
    // Определяем цвет статуса
    const getStatusColor = (status) => {
        switch(status) {
            case 'В обработке': return '#FFA500';
            case 'Доставка': return '#4CAF50';
            case 'Выполнен': return '#2196F3';
            case 'Отменен': return '#F44336';
            default: return '#999';
        }
    };

    return (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>{order.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{order.status}</Text>
                </View>
            </View>

            <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Сумма:</Text>
                    <Text style={styles.detailValue}>{order.price}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Количество:</Text>
                    <Text style={styles.detailValue}>{order.quantity} шт</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Дата:</Text>
                    <Text style={styles.detailValue}>{order.date}</Text>
                </View>
            </View>

            <Button
                title="Подробнее"
                onPress={() => console.log('Детали заказа', order.id)}
                color="#007AFF"
            />
        </View>
    );
};

export default function MainPage({ navigation }) {
    const [isOpen, setIsOpen] = useState(false);
    const scrollViewRef = useRef(null);

    function toggleMenu() {
        setIsOpen(!isOpen);
    }

    return (
        <View style={styles.container}>
            <Header toggleMenu={toggleMenu} />

            {/* Блок с заказами - слайдер */}
            <View style={styles.ordersSection}>
                <Text style={styles.sectionTitle}>Последние заказы</Text>

                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    decelerationRate="fast"
                    snapToInterval={width - 60}
                    snapToAlignment="center"
                    contentContainerStyle={styles.scrollContent}
                >
                    {orders.map((order) => (
                        <View key={order.id} style={[styles.cardContainer, { width: width - 80 }]}>
                            <OrderCard order={order} />
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Навигационные кнопки */}
            <View style={styles.navigationButtons}>
                <Button
                    title="Перейти на регистрацию"
                    onPress={() => navigation.navigate('Registration')}
                />
                <View style={styles.buttonSpacing} />
                <Button
                    title="Перейти на Логин"
                    onPress={() => navigation.navigate('Login')}
                />
            </View>

            <Menu isOpen={isOpen} toggleMenu={toggleMenu} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#EFEFEF",
        height: "100%",
    },
    ordersSection: {
        marginTop: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        textAlign: "center",
        marginBottom: 15,
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    cardContainer: {
        marginRight: 15,
        paddingVertical: 5,
    },
    orderCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        minHeight: 220, // Делаем карточку длиннее
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    orderTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "500",
    },
    orderDetails: {
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10, // Увеличил отступ между строками
    },
    detailLabel: {
        fontSize: 14,
        color: "#666",
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
    navigationButtons: {
        paddingHorizontal: 20,
        marginTop: 'auto',
        marginBottom: 20,
    },
    buttonSpacing: {
        height: 10,
    },
});