import {View, Text, StyleSheet, TouchableOpacity} from "react-native";

export default function NewOrder({
                                     createdBy,
                                     location,
                                     shopName,
                                     address,
                                     created,
                                     totalPrice,
                                     orderStatus,
                                     comment,
                                     totalItems,
                                     uniquePositions
                                 }) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.title}>Адрес:</Text>
                <Text style={styles.price}>{address}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.title}>Создано:</Text>
                <Text style={styles.price}>{createdBy}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.title}>Город/Село:</Text>
                <Text style={styles.price}>{location}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.title}>Магазин:</Text>
                <Text style={styles.title}>{shopName}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.title}>Дата:</Text>
                <Text style={styles.price}>{created}</Text>
            </View>

            {/* Обновленная строка с информацией о товарах */}
            <View style={styles.row}>
                <Text style={styles.subtitle}>
                    Позиций: {uniquePositions || 0} шт. | Товаров: {totalItems || 0} шт. | Сумма: {totalPrice}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.subtitle}>Комментарий: {comment}</Text>
            </View>

            <View style={styles.statusWrapper}>

                <Text style={styles.statusBadge}>{orderStatus}</Text>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 360,
        paddingVertical: 18,
        paddingHorizontal: 12,
        flexDirection: "column",
        backgroundColor: "#d5f6ebff",
        borderRadius: 20,
        gap: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "500",
        color: "#333",
    },
    price: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    subtitle: {
        fontSize: 15,
        color: "#444",
    },
    statusWrapper: {
        width: "100%",
        alignItems: "flex-end",
    },
    statusBadge: {
        backgroundColor: "#0C78D3",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 14,
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        overflow: "hidden",
    },
});