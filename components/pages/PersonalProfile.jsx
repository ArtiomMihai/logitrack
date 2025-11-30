import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function PersonalProfile() {
    return (
        <View style={styles.container}>
            {/* Аватар */}
            <Image
                source={require('../../assets/icons8-avatar-40.png')}
                style={styles.avatar}
            />

            {/* Имя */}
            <Text style={styles.info}><Text style={styles.label}>Имя: </Text>Никита Яцко</Text>

            {/* Email */}
            <Text style={styles.info}><Text style={styles.label}>Email: </Text>nikita@example.com</Text>

            {/* Номер телефона */}
            <Text style={styles.info}><Text style={styles.label}>Номер телефона: </Text>+373 123 456 789</Text>

            {/* Роль */}
            <Text style={styles.info}><Text style={styles.label}>Роль: </Text>Администратор</Text>

            {/* Кнопка редактирования */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Редактировать профиль</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8f8f8",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
    },
    info: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#4CAF50",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});
