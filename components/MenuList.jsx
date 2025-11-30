import {Text, View} from "react-native";
import {StyleSheet} from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function MenuList() {
    return (
        <View style={styles.container}>
            <View style={styles.menuItem}>
                <SimpleLineIcons name="notebook" size={24} color="black"/>
                <Text>Список заявок</Text>
            </View>
            <View style={styles.menuItem}>
                <Text>Список магазинов</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25,
        paddingVertical: 15,
        width: "100%",
    },
    menuItem: {
        justifyContent: "space-between",
        gap: 15,
    }
})