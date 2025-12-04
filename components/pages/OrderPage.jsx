import { Text, StyleSheet, ScrollView, View, RefreshControl } from "react-native";
import NewOrder from "../orders/NewOrder";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ActivityIndicator, MD2Colors} from "react-native-paper";

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const response = await fetch(ENDPOINTS.GET_ORDERS, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                console.log("Ошибка загрузки:", response.status);
                return;
            }

            const data = await response.json();

            // Извлекаем массив заказов из data.content
            const ordersArray = Array.isArray(data?.content) ? data.content : [];

            // Сортируем заказы по ID или дате (новые сверху)
            const sortedOrders = [...ordersArray].sort((a, b) =>
                new Date(b.created) - new Date(a.created)
            );

            setOrders(sortedOrders);

        } catch (e) {
            console.log("Ошибка:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadOrders();
    };

    // Функция для подсчета общего количества товаров в заказе
    const calculateTotalItems = (orderItems) => {
        if (!orderItems || !Array.isArray(orderItems)) return 0;

        // Суммируем quantity каждого товара
        const total = orderItems.reduce((sum, item) => {
            return sum + (Number(item.quantity) || 0);
        }, 0);

        return total;
    };

    // Функция для подсчета количества уникальных позиций (разных товаров)
    const calculateUniquePositions = (orderItems) => {
        if (!orderItems || !Array.isArray(orderItems)) return 0;

        // Возвращаем количество элементов в массиве
        return orderItems.length;
    };

    // Форматируем дату для отображения
    const formatDate = (dateString) => {
        if (!dateString) return "Нет даты";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return dateString.substring(0, 10);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#0C78D3"]}
                />
            }
        >
            <Text style={styles.header}>Страница заказов</Text>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator animating={true} color={MD2Colors.red800} />
                </View>
            ) : orders.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>Нет заказов</Text>
                    <Text style={styles.emptySubtext}>Создайте первый заказ</Text>
                </View>
            ) : (
                orders.map(order => {

                    const totalItems = calculateTotalItems(order.orderItems);
                    const uniquePositions = calculateUniquePositions(order.orderItems);

                    return (
                        <NewOrder
                            key={order.orderId}
                            createdBy={order.createdBy || "Не указано"}
                            location={order.location || "Не указано"}
                            shopName={order.shopName || "Не указано"}
                            address={order.address || "Не указано"}
                            created={formatDate(order.created)}
                            totalPrice={`${order.totalPrice || 0} MDL`}
                            orderStatus={order.orderStatus || "NEW"}
                            comment={order.comment || "Нет комментария"}
                            totalItems={totalItems}
                            uniquePositions={uniquePositions}
                        />
                    );
                })
            )}
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
        paddingBottom: 30,
    },
    header: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200,
    },
    emptyText: {
        fontSize: 18,
        color: "#666",
        textAlign: "center",
        marginTop: 20,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        marginTop: 8,
    },
});