import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {ENDPOINTS} from "../../api";

export default function RegisterPage({ navigation }) {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        let valid = true;
        let newErrors = {};

        if (form.fullName.trim().length < 3) {
            newErrors.fullName = "Введите корректное имя";
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            newErrors.email = "Введите корректный E-mail";
            valid = false;
        }

        const phoneRegex = /^[0-9]{8,15}$/;
        if (!phoneRegex.test(form.phone)) {
            newErrors.phone = "Введите корректный номер (только цифры)";
            valid = false;
        }

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
        if (!passwordRegex.test(form.password)) {
            newErrors.password =
                "Пароль должен содержать 1 заглавную букву, 1 цифру и 1 спецсимвол";
            valid = false;
        }

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await fetch(
                ENDPOINTS.REGISTER,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fullName: form.fullName,
                        email: form.email,
                        phoneNumber: form.phone,
                        password: form.password,
                        confirmPassword: form.confirmPassword,
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                console.log("Ошибка регистрации:", data);

            } else {
                console.log("Успешная регистрация:", data);

                if (navigation) navigation.navigate("Login");
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <FontAwesome5 name="car" size={48} color="black" />
                <Text style={styles.fontSize}>LogiTrack</Text>
            </View>

            <TextInput
                style={styles.textInput}
                label="Введите ваше полное имя"
                value={form.fullName}
                mode="outlined"
                outlineColor="lightgray"
                activeOutlineColor="black"
                onChangeText={t => handleChange("fullName", t)}
            />
            {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

            <TextInput
                style={styles.textInput}
                label="Введите ваш E-mail"
                value={form.email}
                mode="outlined"
                outlineColor="lightgray"
                activeOutlineColor="black"
                onChangeText={t => handleChange("email", t)}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
                style={styles.textInput}
                label="Введите номер телефона"
                value={form.phone}
                mode="outlined"
                outlineColor="lightgray"
                activeOutlineColor="black"
                onChangeText={t => handleChange("phone", t)}
                keyboardType="numeric"
            />
            {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

            <TextInput
                style={styles.textInput}
                label="Пароль"
                value={form.password}
                secureTextEntry
                mode="outlined"
                outlineColor="lightgray"
                activeOutlineColor="black"
                onChangeText={t => handleChange("password", t)}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TextInput
                style={styles.textInput}
                label="Подтвердите пароль"
                value={form.confirmPassword}
                secureTextEntry
                mode="outlined"
                outlineColor="lightgray"
                activeOutlineColor="black"
                onChangeText={t => handleChange("confirmPassword", t)}
            />
            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

            <TouchableOpacity onPress={() => navigation?.navigate("Login")}>
                <Text style={{ marginTop: 10, color: "#0c7eda" }}>Уже есть аккаунт? Войти</Text>
            </TouchableOpacity>

            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                loading={loading}
            >
                Зарегистрироваться
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        marginBottom: 20,
    },
    fontSize: {
        fontSize: 32,
        color: "#000",
    },
    textInput: {
        width: "85%",
        backgroundColor: "#fff",
        marginTop: 10,
    },
    button: {
        marginTop: 20,
        width: "85%",
        backgroundColor: "#0c7eda",
        borderRadius: 10,
    },
    error: {
        width: "85%",
        fontSize: 12,
        color: "red",
        marginTop: 2,
    },
});
