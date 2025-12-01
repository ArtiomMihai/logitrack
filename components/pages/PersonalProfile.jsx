import {View, Text, StyleSheet, Button} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {ENDPOINTS} from "../../api";

export default function PersonalProfile() {
    const [user, setUser] = useState(null);
    const navigation = useNavigation();
    const loadProfile = async () => {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            navigation.navigate("Login");
            return;
        }

        try {
            const res = await fetch(
                ENDPOINTS.PROFILE,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        navigation.navigate("Login");
    };

    if (!user) return <Text>Загрузка...</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Имя: {user.fullName}</Text>
            <Text style={styles.label}>Email: {user.email}</Text>
            <Text style={styles.label}>Телефон: {user.phoneNumber}</Text>
            <Text style={styles.label}>Роль: {user.role}</Text>

            <Button title="Выйти" onPress={handleLogout}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: "center", alignItems: "center", padding: 20},
    label: {fontSize: 18, marginBottom: 10},
});
