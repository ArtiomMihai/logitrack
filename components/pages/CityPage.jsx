import {View, Text, StyleSheet, TouchableOpacity} from "react-native";

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
        <View style={styles.container}>
            <Text style={styles.title}>Список городов:</Text>
            {cities.map((city, index) => (
                <TouchableOpacity key={index} activeOpacity={0.7}>
                    <View style={styles.spacecont}>
                        <Text>{city}</Text>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.viewShops}>Посмотреть магазины</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 20,
    },
    spacecont: {
        width: 320,
        borderWidth: 1,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        borderRadius: 20,
    },
    button: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        width: 250,
        height: 60,
        backgroundColor: "#0c7eda",
    },
    cityText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    viewShops: {
        color: "#fff",
    },
    title: {
        paddingVertical: 20,
        fontSize: 18,
        textAlign: "center",
    }
});
