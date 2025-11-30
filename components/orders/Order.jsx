import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Order({shopName, generalPrice, positions}) {
    return (
        <View style={styles.container}>

            <View style={styles.row}>
                <Text style={styles.title}>{shopName}</Text>
                <Text style={styles.price}>{generalPrice}</Text>
            </View>
            <TouchableOpacity style={styles.row} onPress={() => {
            }}>
                <View></View>
                <AntDesign name="arrow-right" size={28} color="#2192fa"/>
            </TouchableOpacity>
            <View style={styles.row}>
                <Text style={styles.subtitle}>Всего: {positions} позиции</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 375,
        paddingVertical: 14,
        paddingHorizontal: 18,
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: 16,
        gap: 8,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    title: {
        fontSize: 22,
        fontWeight: "500",
        color: "#333",
    },

    price: {
        fontSize: 22,
        fontWeight: "500",
        color: "#333",
    },
    subtitle: {
        fontSize: 20,
        color: "#444",
    },
});
