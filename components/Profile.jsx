import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Profile({ toggleMenu }) {
    return (
        <View style={styles.mainBlock}>
            <View style={styles.profileBlock}>
                <FontAwesome name="user-o" size={36} color="black" />
                <Text style={styles.name}>Никита Яцко</Text>
            </View>
            <TouchableOpacity onPress={toggleMenu}>
                <Ionicons name="close-outline" size={36} color="black" style={styles.icon} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    mainBlock: {
        height: 85,
        borderBottomWidth: 2,
        borderBottomColor: "#000",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    profileBlock: {
        flexDirection: "row",
        alignItems: "center",
    },
    name: {
        fontSize: 21,
        marginLeft: 15,
    },
    icon: {
        marginRight: 10,
    }
});