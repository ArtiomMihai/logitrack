import {View, Text, StyleSheet, Button, Image, ActivityIndicator, TouchableOpacity, Pressable} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {ENDPOINTS} from "../../api";
import Icon from "react-native-vector-icons/Feather";
import ChangePhotoModal from "../../components/ChangePhotoModal";

export default function PersonalProfile() {

    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();

    const loadProfile = async () => {

        const token = await AsyncStorage.getItem("token");

        if (!token) {
            navigation.navigate("Login");
            return;
        }

        try {

            const res = await fetch(ENDPOINTS.PROFILE, {
                headers: {Authorization: `Bearer ${token}`}
            });

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

    if (!user) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large"/>
                <Text>Загрузка профиля...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <View style={styles.avatarContainer}>

                <Image
                    source={{uri: user.imageUrl}}
                    style={styles.avatar}
                />

                <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => setModalVisible(true)}
                >
                    <Icon name="edit-2" size={16} color="white"/>
                </TouchableOpacity>

            </View>

            <Text style={styles.name}>{user.fullName}</Text>

            <View style={styles.card}>

                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{user.email}</Text>

                <Text style={styles.label}>Персональный код</Text>
                <Text style={styles.value}>{user.personalCode}</Text>

                <Text style={styles.label}>Телефон</Text>
                <Text style={styles.value}>{user.phoneNumber}</Text>


                <Text style={styles.label}>Обязаности</Text>
                <Text style={styles.value}>
                    {user.roleList.map(r => r.name).join(", ")}
                </Text>



            </View>


                <Pressable style={styles.logout}
                    onPress={handleLogout}

                >
                    <Text style={{color: "#fff"}}>Выйти</Text>
                    </Pressable>


            <ChangePhotoModal
                visible={modalVisible}
                userData ={user}
                loadProfile={loadProfile}
                onClose={() => setModalVisible(false)}
                onSave={(imageUri) => {
                    console.log("Selected image:", imageUri);
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f4f6f8"
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    avatarContainer: {
        position: "relative",
        marginBottom: 20
    },

    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60
    },

    editIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#007AFF",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4
    },

    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20
    },

    card: {
        width: "100%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3
    },

    label: {
        fontSize: 14,
        color: "#888",
        marginTop: 10
    },

    value: {
        fontSize: 18,
        fontWeight: "500"
    },

    logout: {
        marginTop: 30,
        width: "90%",
        height: 50,            // добавили высоту
        borderRadius: 10,      // можно даже height/2 для полностью круглых концов
        backgroundColor: "#007AFF", // чтобы было видно
        justifyContent: "center",
        alignItems: "center",
    }


});
