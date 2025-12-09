// Product.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Product({
                                    id,
                                    name,
                                    brand,
                                    quantityInStock,
                                    unitPrice,
                                    typeOfUnit
                                }) {
    // Определяем цвет для количества в зависимости от уровня
    const getQuantityColor = (quantity) => {
        if (quantity > 50) return '#4caf50'; // зеленый
        if (quantity > 10) return '#ff9800'; // оранжевый
        return '#f44336'; // красный
    };

    // Преобразуем тип единицы
    const formatUnitType = (unit) => {
        const units = {
            'PCS': 'шт',
            'KG': 'кг',
            'L': 'л',
            'M': 'м'
        };
        return units[unit] || unit;
    };

    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={2}>{name}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.brand}>{brand}</Text>
                    </View>
                </View>

                <View style={styles.details}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>
                            ${unitPrice?.toFixed(2)}
                        </Text>
                        <Text style={styles.unit}>
                            /{formatUnitType(typeOfUnit)}
                        </Text>
                    </View>

                    <View style={[
                        styles.quantityContainer,
                        { backgroundColor: `${getQuantityColor(quantityInStock)}15` }
                    ]}>
                        <Text style={[
                            styles.quantity,
                            { color: getQuantityColor(quantityInStock) }
                        ]}>
                            {quantityInStock} шт
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.id}>ID: {id}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginRight: 8,
        lineHeight: 22,
    },
    badge: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    brand: {
        fontSize: 12,
        fontWeight: '500',
        color: '#666',
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    unit: {
        fontSize: 14,
        color: '#666',
        marginLeft: 2,
    },
    quantityContainer: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    quantity: {
        fontSize: 13,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    id: {
        fontSize: 11,
        color: '#999',
        fontFamily: 'monospace',
    },
});