import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function RegisterPage() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" })); // очищаем ошибку
    };

    const validate = () => {
        let valid = true;
        let newErrors = {};

        // FULL NAME
        if (form.fullName.trim().length < 3) {
            newErrors.fullName = "Введите корректное имя";
            valid = false;
        }

        // EMAIL
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            newErrors.email = "Введите корректный E-mail";
            valid = false;
        }

        // PHONE
        const phoneRegex = /^[0-9]{8,15}$/;
        if (!phoneRegex.test(form.phone)) {
            newErrors.phone = "Введите корректный номер (только цифры)";
            valid = false;
        }

        // PASSWORD (1 большая буква, 1 цифра, 1 спец)
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;

        if (!passwordRegex.test(form.password)) {
            newErrors.password =
                "Пароль должен содержать 1 заглавную букву, 1 цифру и 1 спецсимвол";
            valid = false;
        }

        // CONFIRM PASSWORD
        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        console.log("Регистрация:", form);
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <FontAwesome5 name="car" size={48} color="black" />
                <Text style={styles.fontSize}>LogiTrack</Text>
            </View>

            {/* FULLNAME */}
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

            {/* EMAIL */}
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

            {/* PHONE */}
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

            {/* PASSWORD */}
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

            {/* CONFIRM PASSWORD */}
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
            {errors.confirmPassword &&
                <Text style={styles.error}>{errors.confirmPassword}</Text>
            }

            <Text>Уже есть аккаунт? Войти</Text>

            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                Зарегистрироваться
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        marginTop: 20,
    },
    container: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        backgroundColor: "#fff",
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
        fontSize: 12,
        color: "red",
        marginTop: -15,
    },
});
