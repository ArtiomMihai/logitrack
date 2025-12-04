import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import EvilIcons from '@expo/vector-icons/EvilIcons';

export default function NewOrder({
                                     id, // Добавляем ID заказа
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
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate("OrderDetails", {
            orderId: id
        });
    };

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

            <View style={styles.row}>
                <Text style={styles.subtitle}>
                    Позиций: {uniquePositions || 0} шт. | Товаров: {totalItems || 0} шт. | Сумма: {totalPrice}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.subtitle}>Комментарий: {comment}</Text>
            </View>

            <View style={styles.statusWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handlePress}
                >
                    <Text style={styles.buttonText}>Перейти</Text>
                    <EvilIcons name="arrow-right" size={32} color="white" />
                </TouchableOpacity>

                <Text style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(orderStatus) }
                ]}>
                    {orderStatus}
                </Text>
            </View>
        </View>
    );
}
const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
        case 'NEW': return '#2196F3'; // синий
        case 'PROCESSING': return '#FF9800'; // оранжевый
        case 'COMPLETED': return '#4CAF50'; // зеленый
        case 'CANCELLED': return '#F44336'; // красный
        default: return '#424242'; // серый
    }
};

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
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 250,
        height: 40,
        borderRadius: 5,
        backgroundColor: "#0C78D3",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
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
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
    },
    statusBadge: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 5,
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        overflow: "hidden",
    },
});