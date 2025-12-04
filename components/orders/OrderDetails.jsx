import { DataTable } from "react-native-paper";
import { Text, StyleSheet, ScrollView, View, ActivityIndicator, RefreshControl } from "react-native";
import OrderItem from "./OrderItem";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import {API_BASE_URL, ENDPOINTS} from "../../api";

export default function OrderDetails() {
    const route = useRoute();
    const { orderId } = route.params; // Получаем ID заказа из навигации

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (orderId) {
            loadOrderDetails();
        }
    }, [orderId]);

    const loadOrderDetails = async () => {
        try {
            setRefreshing(true);
            setError(null);

            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }

            const data = await response.json();
            setOrder(data);

        } catch (e) {
            console.log("Ошибка загрузки деталей заказа:", e);
            setError(e.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadOrderDetails();
    };

    if (loading && !refreshing) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#0C78D3" />
                    <Text style={styles.loadingText}>Загружаем детали заказа...</Text>
                </View>
            );

    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Ошибка загрузки</Text>
                <Text style={styles.errorSubtext}>{error}</Text>
                <Text
                    style={styles.retryText}
                    onPress={loadOrderDetails}
                >
                    ⟳ Попробовать снова
                </Text>
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Заказ не найден</Text>
                <Text style={styles.errorSubtext}>Заказ с ID {orderId} не существует</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#0C78D3"]}
                />
            }
        >
            <View style={styles.header}>
                <Text style={styles.orderTitle}>Заказ #{order.orderId}</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Магазин:</Text>
                    <Text style={styles.infoValue}>{order.shopName}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Адрес:</Text>
                    <Text style={styles.infoValue}>{order.address}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Дата:</Text>
                    <Text style={styles.infoValue}>
                        {order.created ? new Date(order.created).toLocaleDateString('ru-RU') : 'Нет даты'}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Создал:</Text>
                    <Text style={styles.infoValue}>{order.createdBy}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Статус:</Text>
                    <Text style={[
                        styles.statusText,
                        { color: getStatusColor(order.orderStatus) }
                    ]}>
                        {order.orderStatus}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Общая сумма:</Text>
                    <Text style={styles.totalPrice}>{order.totalPrice?.toFixed(2)} MDL</Text>
                </View>

                {order.comment && (
                    <View style={styles.commentContainer}>
                        <Text style={styles.commentLabel}>Комментарий:</Text>
                        <Text style={styles.commentText}>{order.comment}</Text>
                    </View>
                )}
            </View>

            <Text style={styles.itemsTitle}>Товары в заказе</Text>

            <DataTable style={styles.table}>
                <DataTable.Header style={styles.tableHeader}>
                    <DataTable.Title style={styles.nameCol}>Название</DataTable.Title>
                    <DataTable.Title style={styles.qtyCol} numeric>Кол-во</DataTable.Title>
                    <DataTable.Title style={styles.priceCol} numeric>Цена за ед.</DataTable.Title>
                    <DataTable.Title style={styles.totalCol} numeric>Сумма</DataTable.Title>
                </DataTable.Header>

                {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item, index) => (
                        <OrderItem
                            key={item.id || index}
                            name={item.productName}
                            quantity={item.quantity}
                            unitPrice={item.unitPrice}
                            totalPrice={item.totalPrice}
                            unitType={item.typeOfUnit}
                            brand={item.brand}
                        />
                    ))
                ) : (
                    <DataTable.Row>
                        <DataTable.Cell>
                            <Text style={styles.emptyText}>Нет товаров в заказе</Text>
                        </DataTable.Cell>
                    </DataTable.Row>
                )}

                {/* Итоговая строка */}
                <DataTable.Row style={styles.footerRow}>
                    <DataTable.Cell>Итого:</DataTable.Cell>
                    <DataTable.Cell numeric>
                        {order.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>-</DataTable.Cell>
                    <DataTable.Cell numeric style={styles.footerTotal}>
                        {order.totalPrice?.toFixed(2)} MDL
                    </DataTable.Cell>
                </DataTable.Row>
            </DataTable>
        </ScrollView>
    );
}

// Функция для цвета статуса
const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
        case 'NEW': return '#2196F3';
        case 'PROCESSING': return '#FF9800';
        case 'COMPLETED': return '#4CAF50';
        case 'CANCELLED': return '#F44336';
        default: return '#9E9E9E';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFEFEF",
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#EFEFEF",
    },
    loadingText: {
        marginTop: 12,
        color: "#666",
        fontSize: 16,
    },
    errorText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#D32F2F",
        marginBottom: 8,
    },
    errorSubtext: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    retryText: {
        fontSize: 16,
        color: "#0C78D3",
        fontWeight: "600",
        padding: 10,
    },
    header: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    orderTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
        textAlign: "center",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        paddingVertical: 4,
    },
    infoLabel: {
        fontSize: 15,
        color: "#666",
        fontWeight: "500",
    },
    infoValue: {
        fontSize: 15,
        color: "#333",
        fontWeight: "500",
    },
    statusText: {
        fontSize: 15,
        fontWeight: "600",
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0C78D3",
    },
    commentContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#EEE",
    },
    commentLabel: {
        fontSize: 15,
        color: "#666",
        fontWeight: "500",
        marginBottom: 4,
    },
    commentText: {
        fontSize: 14,
        color: "#555",
        fontStyle: "italic",
    },
    itemsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
    },
    table: {
        backgroundColor: "white",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 30,
    },
    tableHeader: {
        backgroundColor: "#F8F9FA",
    },
    nameCol: { flex: 2.6 },
    qtyCol: { flex: 1.2 },
    priceCol: { flex: 2 },
    totalCol: { flex: 2 },
    emptyText: {
        textAlign: "center",
        color: "#999",
        fontStyle: "italic",
        padding: 20,
    },
    footerRow: {
        backgroundColor: "#F8F9FA",
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
    },
    footerTotal: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0C78D3",
    },
});