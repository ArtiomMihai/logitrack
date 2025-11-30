import {Text, TouchableOpacity, View} from "react-native";
import {StyleSheet} from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function MenuList() {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <View style={styles.menuItem}>
                    <SimpleLineIcons name="notebook" size={32} color="black" style={styles.icon}/>
                    <Text style={styles.text}>Список заявок</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity>

                <View style={styles.menuItem}>
                    <AntDesign name="shop" size={32} color="black" style={styles.icon}/>
                    <Text style={styles.text}>Список магазинов</Text>
                </View>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap:20,
        paddingHorizontal: 20,
        paddingVertical: 15,
        width: "100%",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",

    },
    icon: {
        marginRight: 15,
    },
    text:{
        fontSize:16,
    }
})