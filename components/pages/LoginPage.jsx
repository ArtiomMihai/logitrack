import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {TextInput, Button} from "react-native-paper";
import {useState} from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import {ENDPOINTS} from "../../api";

export default function LoginPage() {
    const navigation = useNavigation();
    const [form, setForm] = useState({email: "", password: ""});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setForm(prev => ({...prev, [field]: value}));
        setErrors(prev => ({...prev, [field]: ""}));
    };

    const validate = () => {
        let valid = true;
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            newErrors.email = "Введите корректный email";
            valid = false;
        }
        if (!form.password || form.password.length < 6) {
            newErrors.password = "Введите пароль (мин 6 символов)";
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
                ENDPOINTS.LOGIN,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email: form.email, password: form.password}),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                console.log("Ошибка входа:", data);
            } else {
                console.log("Успешный вход:", data);
                await AsyncStorage.setItem("token", data.token);
                navigation.navigate("Main");
            }
        } catch (err) {
            console.error("Ошибка сети:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <FontAwesome5 name="car" size={48} color="black"/>
                <Text style={styles.fontSize}>LogiTrack</Text>
            </View>

            <TextInput
                label="E-mail"
                value={form.email}
                mode="outlined"
                style={styles.textInput}
                onChangeText={t => handleChange("email", t)}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
                label="Пароль"
                value={form.password}
                secureTextEntry
                mode="outlined"
                style={styles.textInput}
                onChangeText={t => handleChange("password", t)}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={{marginTop: 10, color: "#0c7eda"}}>Нет аккаунта? Зарегистрироваться</Text>
            </TouchableOpacity>

            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                loading={loading}
            >
                Войти
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff"},
    title: {flexDirection: "row", alignItems: "center", gap: 20, marginBottom: 20},
    fontSize: {fontSize: 32, color: "#000"},
    textInput: {width: "85%", marginTop: 10, backgroundColor: "#fff"},
    button: {marginTop: 20, width: "85%", backgroundColor: "#0c7eda", borderRadius: 10},
    error: {width: "85%", fontSize: 12, color: "red", marginTop: 2},
});
