import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
    });

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        let valid = true;
        let newErrors = {};

        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            newErrors.email = "Введите корректный email";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        console.log("OK:", form);
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <FontAwesome5 name="car" size={48} color="black" />
                <Text style={styles.fontSize}>LogiTrack</Text>
            </View>

            {/* EMAIL */}
            <TextInput
                label="Введите ваш E-mail"
                value={form.email}
                mode="outlined"
                outlineColor="lightgray"
                activeOutlineColor="black"
                style={styles.textInput}
                onChangeText={(text) => handleChange("email", text)}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            {/* PASSWORD (без валидации) */}
            <TextInput
                label="Введите пароль"
                value={form.password}
                secureTextEntry
                mode="outlined"
                outlineColor="lightgray"
                activeOutlineColor="black"
                style={styles.textInput}
                onChangeText={(text) => handleChange("password", text)}
            />

            <Text>Нет аккаунта? Зарегистрироваться</Text>

            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                Войти
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        backgroundColor: "#fff",
    },
    title: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },
    textInput: {
        width: "85%",
        backgroundColor: "white",
    },
    fontSize: {
        fontSize: 32,
        color: "#000000",
    },
    button: {
        marginTop: 2,
        width: "85%",
        backgroundColor: "#0c7eda",
        borderRadius: 10,
    },
    error: {
        width: "85%",
        color: "red",
        fontSize: 12,
        marginTop: -15,
    },
});
