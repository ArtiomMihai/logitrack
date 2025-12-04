import React, {useEffect, useState} from 'react';
import {DataTable, ActivityIndicator} from 'react-native-paper';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ENDPOINTS} from '../../api';

const ShopsTable = () => {
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 20]);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadShops();
    }, [page, itemsPerPage]);

    const loadShops = async () => {
        try {
            if (!refreshing) {
                setLoading(true);
            }
            setError(null);

            const token = await AsyncStorage.getItem("token");

            const response = await fetch(
                `${ENDPOINTS.GET_SHOPS}?page=${page}&size=${itemsPerPage}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }

            const data = await response.json();

            setShops(data.content || []);
            setTotalItems(data.pagination?.total || 0);
            setTotalPages(data.pagination?.pages || 0);

        } catch (e) {
            console.log("Ошибка загрузки магазинов:", e);
            setError(e.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setPage(0);
        loadShops();
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handleItemsPerPageChange = (value) => {
        onItemsPerPageChange(value);
        setPage(0);
    };

    // Рассчитываем from и to для отображения
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, totalItems);

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0C78D3"/>
                <Text style={styles.loadingText}>Загружаем список магазинов...</Text>
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
                    onPress={loadShops}
                >
                    ⟳ Попробовать снова
                </Text>
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
                <Text style={styles.title}>📦 Магазины</Text>
                <Text style={styles.subtitle}>Список всех магазинов</Text>
            </View>

            <DataTable style={styles.table}>
                <DataTable.Header style={styles.tableHeader}>
                    <DataTable.Title style={styles.idCol}>ID</DataTable.Title>
                    <DataTable.Title style={styles.nameCol}>Название</DataTable.Title>
                    <DataTable.Title style={styles.cityCol}>Город</DataTable.Title>
                    <DataTable.Title style={styles.addressCol}>Адрес</DataTable.Title>
                </DataTable.Header>

                {shops.length > 0 ? (
                    shops.map((shop) => (
                        <DataTable.Row key={shop.id} style={styles.row}>
                            <DataTable.Cell style={styles.idCell}>
                                <Text style={styles.idText}>#{shop.id}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.nameCell}>
                                <Text style={styles.shopName}>{shop.name}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.cityCell}>
                                <View style={styles.cityBadge}>
                                    <Text style={styles.cityText}>{shop.locatedIn}</Text>
                                </View>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.addressCell}>
                                <Text style={styles.addressText}>{shop.address}</Text>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))
                ) : (
                    <DataTable.Row>
                        <DataTable.Cell colSpan={4}>
                            <Text style={styles.emptyText}>Нет магазинов</Text>
                        </DataTable.Cell>
                    </DataTable.Row>
                )}

                <View style={styles.paginationContainer}>
                    <View style={styles.paginationControls}>
                        <Text
                            style={[
                                styles.paginationButton,
                                page === 0 && styles.paginationButtonDisabled
                            ]}
                            onPress={() => page > 0 && handlePageChange(page - 1)}
                        >
                            ← Назад
                        </Text>

                        <View style={styles.pageInfo}>
                            <Text style={styles.pageText}>
                                Страница {page + 1} из {totalPages}
                            </Text>
                            <Text style={styles.pageRange}>
                                {from + 1}-{Math.min(to, totalItems)} из {totalItems}
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.paginationButton,
                                page >= totalPages - 1 && styles.paginationButtonDisabled
                            ]}
                            onPress={() => page < totalPages - 1 && handlePageChange(page + 1)}
                        >
                            Вперед →
                        </Text>
                    </View>

                    <View style={styles.pageSizeContainer}>
                        <Text style={styles.pageSizeLabel}>Показывать:</Text>
                        {numberOfItemsPerPageList.map((size) => (
                            <Text
                                key={size}
                                style={[
                                    styles.pageSizeOption,
                                    itemsPerPage === size && styles.pageSizeOptionActive
                                ]}
                                onPress={() => handleItemsPerPageChange(size)}
                            >
                                {size}
                            </Text>
                        ))}
                    </View>
                </View>
            </DataTable>

            <View style={styles.stats}>
                <Text style={styles.statText}>
                    Всего магазинов: <Text style={styles.statValue}>{totalItems}</Text>
                </Text>
                <Text style={styles.statText}>
                    Страница: <Text style={styles.statValue}>{page + 1} из {totalPages}</Text>
                </Text>
                <Text style={styles.statText}>
                    Показано: <Text style={styles.statValue}>{shops.length}</Text>
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#F5F5F5",
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
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    table: {
        backgroundColor: "white",
        margin: 16,
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tableHeader: {
        backgroundColor: "#F8F9FA",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    idCol: {
        flex: 0.7,
    },
    nameCol: {
        flex: 1.5,
    },
    cityCol: {
        flex: 0.7,
    },
    addressCol: {
        flex: 2,
        marginLeft: 20,
    },
    row: {
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    idCell: {
        flex: 0.7,
    },
    idText: {
        fontSize: 13,
        color: "#666",
        fontWeight: "500",
    },
    nameCell: {
        flex: 1.5,
    },
    shopName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },
    cityCell: {
        flex: 1.5,
    },
    cityBadge: {
        backgroundColor: "#E3F2FD",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,

    },
    cityText: {
        fontSize: 11,
        color: "#1976D2",
        fontWeight: "500",
    },
    addressCell: {
        flex: 2.5,
    },
    addressText: {
        fontSize: 13,
        color: "#555",
    },
    emptyText: {
        textAlign: "center",
        color: "#999",
        fontStyle: "italic",
        padding: 40,
        fontSize: 16,
    },
    paginationContainer: {
        backgroundColor: "#F8F9FA",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
    },
    paginationControls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    paginationButton: {
        fontSize: 14,
        color: "#0C78D3",
        fontWeight: "600",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    paginationButtonDisabled: {
        color: "#CCC",
    },
    pageInfo: {
        alignItems: "center",
    },
    pageText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 2,
    },
    pageRange: {
        fontSize: 12,
        color: "#999",
    },
    pageSizeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    pageSizeLabel: {
        fontSize: 14,
        color: "#666",
        marginRight: 12,
    },
    pageSizeOption: {
        fontSize: 14,
        color: "#666",
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginHorizontal: 4,
        borderRadius: 4,
        backgroundColor: "#F0F0F0",
    },
    pageSizeOptionActive: {
        backgroundColor: "#0C78D3",
        color: "white",
        fontWeight: "600",
    },
    stats: {
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "white",
        marginHorizontal: 16,
        marginBottom: 20,
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    statText: {
        fontSize: 14,
        color: "#666",
    },
    statValue: {
        fontWeight: "bold",
        color: "#333",
    },
});

export default ShopsTable;