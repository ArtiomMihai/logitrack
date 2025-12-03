import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export function CityPage() {
    const cities = [
        "Chișinău",
        "Bălți",
        "Cahul",
        "Orhei",
        "Soroca",
        "Ungheni",
        "Comrat",
        "Edineț",
        "Hîncești",
        "Tiraspol",
        "Dubăsari",
    ];

    return (
        <View>
            {cities.map((city, index) => (
                <TouchableOpacity key={index} activeOpacity={0.7}>
                    <View style={styles.spacecont}>
                        <Text style={styles.cityText}>{city}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    spacecont: {
        width: 360,
        backgroundColor: "#4d9cf7",
        height: 45,
        marginVertical: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },
    cityText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});
