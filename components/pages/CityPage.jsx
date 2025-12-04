import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../api";

export function CityPage({ navigation }) {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCities();
    }, []);

    const loadCities = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/settlements`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}`);
            }

            const data = await response.json();
            setCities(data.content || []);

        } catch (e) {
            console.log("Ошибка загрузки городов:", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCityPress = (city) => {
        navigation.navigate("CityShops", {
            cityId: city.id,
            cityName: city.name,
            shops: city.shopList
        });
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0C78D3" />
                <Text style={styles.loadingText}>Загружаем города...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Ошибка загрузки</Text>
                <Text style={styles.errorSubtext}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadCities}>
                    <Text style={styles.retryText}>⟳ Попробовать снова</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (cities.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>Нет городов</Text>
                <Text style={styles.emptySubtext}>Добавьте первый город</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>🏙️ Города</Text>
            <Text style={styles.subtitle}>Выберите город для просмотра магазинов</Text>

            <View style={styles.citiesContainer}>
                {cities.map((city) => (
                    <TouchableOpacity
                        key={city.id}
                        style={styles.cityCard}
                        onPress={() => handleCityPress(city)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cityHeader}>
                            <Text style={styles.cityNumber}>#{city.id}</Text>
                            <View style={styles.cityInfo}>
                                <Text style={styles.cityName}>{city.name}</Text>
                                <Text style={styles.cityShops}>
                                    Магазинов: {city.shopList?.length || 0}
                                </Text>
                            </View>
                        </View>

                        {/* Список магазинов (первые 3) */}
                        {city.shopList && city.shopList.length > 0 && (
                            <View style={styles.shopsPreview}>
                                {city.shopList.slice(0, 3).map((shop, index) => (
                                    <View key={shop.id} style={styles.shopPreview}>
                                        <Text style={styles.shopName}>• {shop.name}</Text>
                                        {index < 2 && <Text style={styles.comma}>, </Text>}
                                    </View>
                                ))}
                                {city.shopList.length > 3 && (
                                    <Text style={styles.moreShops}> и ещё {city.shopList.length - 3}</Text>
                                )}
                            </View>
                        )}

                        <View style={styles.cityFooter}>
                            <TouchableOpacity style={styles.viewButton}>
                                <Text style={styles.viewButtonText}>Посмотреть все →</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.stats}>
                <Text style={styles.statText}>
                    Всего городов: <Text style={styles.statValue}>{cities.length}</Text>
                </Text>
                <Text style={styles.statText}>
                    Всего магазинов: <Text style={styles.statValue}>
                    {cities.reduce((sum, city) => sum + (city.shopList?.length || 0), 0)}
                </Text>
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 16,
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
    retryButton: {
        backgroundColor: "#0C78D3",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: "white",
        fontWeight: "600",
    },
    emptyText: {
        fontSize: 20,
        color: "#666",
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#999",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 24,
    },
    citiesContainer: {
        gap: 16,
        marginBottom: 24,
    },
    cityCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    cityHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    cityNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#0C78D3",
        width: 40,
    },
    cityInfo: {
        flex: 1,
    },
    cityName: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    cityShops: {
        fontSize: 14,
        color: "#666",
    },
    shopsPreview: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    shopPreview: {
        flexDirection: "row",
        alignItems: "center",
    },
    shopName: {
        fontSize: 14,
        color: "#555",
    },
    comma: {
        fontSize: 14,
        color: "#555",
        marginRight: 4,
    },
    moreShops: {
        fontSize: 14,
        color: "#0C78D3",
        fontStyle: "italic",
    },
    cityFooter: {
        alignItems: "flex-end",
    },
    viewButton: {
        backgroundColor: "#0C78D3",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    viewButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
    stats: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 20,
    },
    statText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8,
    },
    statValue: {
        fontWeight: "bold",
        color: "#333",
    },
});