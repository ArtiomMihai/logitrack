import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Header({ toggleMenu }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                <AntDesign name="align-left" size={36} color="white" />
            </TouchableOpacity>
            <Text style={styles.text}>LogiTrack</Text>
            <View style={{ width: 36 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,

        height: 80,
        width: "100%",
        backgroundColor: "#b94a48",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    },
    text: {
        color: "#FFF",
        fontSize: 24,
        fontWeight: "700",
    },
    menuButton: {
        padding: 5,
    },
});
