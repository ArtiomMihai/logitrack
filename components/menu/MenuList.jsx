import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';


export default function MenuList() {
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.8}>
                 
                <View style={styles.menuItem}>

                    <SimpleLineIcons name="notebook" size={28} color="#333" style={styles.icon}/>
                    <Text style={styles.text}>Список заявок</Text>

                </View>
                
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8}>
                <View style={styles.menuItem}>

                    <AntDesign name="shop" size={28} color="#333" style={styles.icon}/>
                    <Text style={styles.text}>Магазины</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 15,
        paddingHorizontal: 20,
        paddingVertical: 15,
        width: "100%",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 12,
        backgroundColor: "#D6E4FF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    icon: {
        marginRight: 15,
    },
    text: {
        fontSize: 12,
        color: "#424242",
        fontWeight: "500",
    },
});
