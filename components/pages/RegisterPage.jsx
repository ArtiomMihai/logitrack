import {TextInput, Button} from "react-native-paper";
import {useState} from "react";
import {StyleSheet, View, Text} from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function RegisterPage() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (field, value) => {
        setForm(prev => ({...prev, [field]: value}));
    };

    const handleSubmit = () => {
        console.log(form);
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <FontAwesome5 name="car" size={48} color="black"/>
                <Text style={styles.fontSize}>LogiTrack</Text>
            </View>

            {["fullName", "email", "phone", "password", "confirmPassword"].map((field, index) => (
                <TextInput
                    key={index}
                    style={styles.textInput}
                    label={
                        field === "fullName" ? "Введите ваше полное имя" :
                            field === "email" ? "Введите ваш E-mail" :
                                field === "phone" ? "Введите номер телефона" :
                                    field === "password" ? "Пароль" :
                                        "Подтвердите пароль"
                    }
                    value={form[field]}
                    secureTextEntry={field.includes("password")}
                    mode="outlined"
                    outlineColor="lightgray"
                    activeOutlineColor="black"
                    onChangeText={text => handleChange(field, text)}
                />
            ))}
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
        backgroundColor: "",
        borderRadius: 10
    },

});

