import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Profile({toggleMenu}) {
    return (
        <>
            <View style={styles.mainBlock}>
                <View style={styles.profileBlock}>
                    <FontAwesome name="user-o" size={30} color="#1A1A40"/>
                    <Text style={styles.name}>Никита Яцко</Text>
                </View>
                <TouchableOpacity onPress={toggleMenu}>
                    <Ionicons name="close-outline" size={36} color="#1A1A40"/>
                </TouchableOpacity>
            </View>
            <View style={styles.divider}/></>
    );
}

const styles = StyleSheet.create({
    mainBlock: {
        height: 80,
        borderRadius: 12,

        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    profileBlock: {
        flexDirection: "row",
    },
    name: {
        fontSize: 20,
        marginLeft: 12,
        fontWeight: "600",

    }, divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginHorizontal: 15,

    },
});
