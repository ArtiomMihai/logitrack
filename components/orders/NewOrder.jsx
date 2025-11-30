import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function NewOrder() {
    return (
        <View style={styles.container}>

            <View style={styles.row}>
                <Text style={styles.title}>Адрес:</Text>
                <Text style={styles.price}>нужный адрес</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.title}>Создано:</Text>
                <Text style={styles.price}>Никита Михай</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.title}>Магазин: Linela</Text>
                <TouchableOpacity onPress={() => { }}>
                    <AntDesign name="arrow-right" size={28} color="#2192fa" />
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <Text style={styles.title}>Дата:</Text>
                <Text style={styles.price}>DD.MM.YYYY</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.subtitle}>Позиции / Цена: 50 п. — 9000 лей</Text>
            </View>

            <View style={styles.statusWrapper}>
                <TouchableOpacity onPress={() => { }}>
                <Text style={styles.statusBadge}>NEW</Text>
                </TouchableOpacity>
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
        backgroundColor: "#ebd5ae",
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
        fontSize: 17,
        color: "#444",
    },


    status: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
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
