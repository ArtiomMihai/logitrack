import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../api";

export default function CreateOrder({ navigation }) {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedShop, setSelectedShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const loadCities = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/api/settlements`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setCities(data.content || []);
            } catch (err) {
                console.error(err);
            }
        };
        loadCities();
    }, []);

    useEffect(() => {
        if (!selectedShop) return;
        const loadProducts = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/api/products`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setProducts((data.content || []).map(p => ({ ...p, quantity: 0 })));
            } catch (err) {
                console.error(err);
            }
        };
        loadProducts();
    }, [selectedShop]);

    const updateQuantity = (productId, qty) => {
        setProducts(prev =>
            prev.map(p => (p.id === productId ? { ...p, quantity: Number(qty) } : p))
        );
    };

    const calculateTotal = () => {
        return products.reduce((sum, p) => sum + p.unitPrice * p.quantity * 20, 0);
    };

    const submitOrder = async () => {
        const items = products.filter(p => p.quantity > 0).map(p => ({ productId: p.id, quantity: p.quantity }));
        if (!selectedCity || !selectedShop || items.length === 0) {
            Alert.alert("Ошибка", "Выберите город, магазин и хотя бы один продукт");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ settlementId: selectedCity.id, shopId: selectedShop.id, items, comment }),
            });

            if (!res.ok) throw new Error("Ошибка создания заказа");

            Alert.alert("Успех", "Заказ создан!");
            navigation.goBack();
        } catch (err) {
            console.error(err);
            Alert.alert("Ошибка", err.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
                    <Text style={styles.title}>Создание заказа</Text>

                    <Text style={styles.label}>Выберите город:</Text>
                    {cities.map(city => (
                        <TouchableOpacity
                            key={city.id}
                            onPress={() => { setSelectedCity(city); setSelectedShop(null); }}
                            style={[styles.button, selectedCity?.id === city.id && styles.selectedButton]}
                        >
                            <Text style={styles.buttonText}>{city.name}</Text>
                        </TouchableOpacity>
                    ))}

                    {selectedCity && (
                        <>
                            <Text style={styles.label}>Выберите магазин:</Text>
                            {selectedCity.shopList.map(shop => (
                                <TouchableOpacity
                                    key={shop.id}
                                    onPress={() => setSelectedShop(shop)}
                                    style={[styles.button, selectedShop?.id === shop.id && styles.selectedButton]}
                                >
                                    <Text style={styles.buttonText}>{shop.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}

                    {selectedShop && (
                        <>
                            <Text style={styles.label}>Выберите продукты и количество:</Text>
                            {products.map(product => (
                                <View key={product.id} style={styles.productRow}>
                                    <Text style={styles.productName}>{product.name} ({product.brand})</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0"
                                        keyboardType="numeric"
                                        value={product.quantity.toString()}
                                        onChangeText={text => updateQuantity(product.id, text)}
                                    />
                                </View>
                            ))}

                            <Text style={styles.label}>Комментарий:</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                placeholder="Ваш комментарий"
                                value={comment}
                                onChangeText={setComment}
                                multiline
                            />

                            <Text style={styles.total}>Сумма: {calculateTotal()} леев</Text>
                        </>
                    )}
                </ScrollView>

                {/* Кнопка фиксированная внизу */}
                <TouchableOpacity style={styles.fixedButton}  onPress={() => submitOrder()}>
                    <Text style={styles.submitText}>Создать заказ</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    label: { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 8 },
    button: { padding: 10, backgroundColor: "#eee", borderRadius: 8, marginBottom: 8 },
    selectedButton: { backgroundColor: "#0C78D3" },
    buttonText: { color: "#333" },
    productRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, justifyContent: "space-between" },
    productName: { flex: 1 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 6, borderRadius: 6, width: 60, textAlign: "center", marginLeft: 10 },
    total: { fontSize: 16, fontWeight: "bold", marginTop: 16 },
    fixedButton: {
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        backgroundColor: "#0C78D3",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
    },
    submitText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
