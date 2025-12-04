import { Text, StyleSheet, ScrollView, View, RefreshControl, TouchableOpacity } from "react-native";
import NewOrder from "../orders/NewOrder";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import {useNavigation} from "@react-navigation/native";


export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("ALL");

    const statuses = ["ALL", "NEW", "PROCESSING", "COMPLETED", "CANCELLED"];
    const navigation = useNavigation();
    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [orders, selectedStatus]);

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
            const ordersArray = Array.isArray(data?.content) ? data.content : [];
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

    const applyFilter = () => {
        if (selectedStatus === "ALL") {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order =>
                order.orderStatus?.toUpperCase() === selectedStatus.toUpperCase()
            );
            setFilteredOrders(filtered);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadOrders();
    };


    const calculateTotalItems = (orderItems) => {
        if (!orderItems || !Array.isArray(orderItems)) return 0;

        const total = orderItems.reduce((sum, item) => {
            return sum + (Number(item.quantity) || 0);
        }, 0);

        return total;
    };

    const calculateUniquePositions = (orderItems) => {
        if (!orderItems || !Array.isArray(orderItems)) return 0;

        // Возвращаем количество элементов в массиве
        return orderItems.length;
    };

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

    const getStatusDisplayName = (status) => {
        switch (status.toUpperCase()) {
            case "ALL": return "Все";
            case "NEW": return "Новые";
            case "PROCESSING": return "В обработке";
            case "COMPLETED": return "Завершённые";
            case "CANCELLED": return "Отменённые";
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toUpperCase()) {
            case "NEW": return "#2196F3";
            case "PROCESSING": return "#FF9800";
            case "COMPLETED": return "#4CAF50";
            case "CANCELLED": return "#F44336";
            default: return "#9E9E9E";
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
            <Text style={styles.header}>Заказы</Text>


            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                >
                    {statuses.map(status => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filterButton,
                                selectedStatus === status && styles.filterButtonActive,
                                selectedStatus === status && {
                                    backgroundColor: getStatusColor(status)
                                }
                            ]}
                            onPress={() => setSelectedStatus(status)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedStatus === status && styles.filterTextActive
                            ]}>
                                {getStatusDisplayName(status)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>


                <View style={styles.filterInfo}>
                    <Text style={styles.filterInfoText}>
                        Показано: {filteredOrders.length} из {orders.length}
                    </Text>
                    {selectedStatus !== "ALL" && (
                        <TouchableOpacity
                            onPress={() => setSelectedStatus("ALL")}
                            style={styles.clearFilter}
                        >
                            <Text style={styles.clearFilterText}>× Сбросить</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator animating={true} color={MD2Colors.red800} />
                </View>
            ) : filteredOrders.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>
                        {selectedStatus === "ALL"
                            ? "Нет заказов"
                            : `Нет заказов со статусом "${getStatusDisplayName(selectedStatus)}"`}
                    </Text>
                    <Text style={styles.emptySubtext}>
                        {selectedStatus === "ALL"
                            ? "Создайте первый заказ"
                            : "Попробуйте изменить фильтр"}
                    </Text>
                </View>
            ) : (
                filteredOrders.map(order => {
                    const totalItems = calculateTotalItems(order.orderItems);
                    const uniquePositions = calculateUniquePositions(order.orderItems);

                    return (
                        <NewOrder
                            id={order.orderId}
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
    filterContainer: {
        marginBottom: 16,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    filterScroll: {
        marginBottom: 8,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
        marginRight: 8,
        minWidth: 80,
        alignItems: "center",
    },
    filterButtonActive: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    filterText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    filterTextActive: {
        color: "white",
        fontWeight: "600",
    },
    filterInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    filterInfoText: {
        fontSize: 13,
        color: "#666",
    },
    clearFilter: {
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    clearFilterText: {
        fontSize: 13,
        color: "#F44336",
        fontWeight: "500",
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