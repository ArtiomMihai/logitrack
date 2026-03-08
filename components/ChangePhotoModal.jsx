import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import {useState, useEffect, useRef} from "react";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ENDPOINTS} from "../api"; // Убедись, что здесь есть ENDPOINTS.UPLOAD_PROFILE_PHOTO

export default function ChangePhotoModal({visible, onClose, userData,loadProfile}) {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {toValue: 1, friction: 7, useNativeDriver: true}),
                Animated.timing(opacityAnim, {toValue: 1, duration: 200, useNativeDriver: true})
            ]).start();
        } else {
            scaleAnim.setValue(0.9);
            opacityAnim.setValue(0);
            setImage(null);
            setUploading(false);
        }
    }, [visible]);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert("Разрешите доступ к галерее");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleUpload = async () => {
        if (!image) return;

        setUploading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) throw new Error("Нет токена авторизации");

            // POST фото
            const formData = new FormData();
            formData.append("file", {
                uri: image,
                name: "profile.jpg",
                type: "image/jpeg",
            });

            const res = await fetch(ENDPOINTS.UPLOAD_PROFILE_PHOTO, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) {
                throw new Error("Ошибка при загрузке фото");
            } else {
                // перезагружаем страницу
                loadProfile()
            }

        } catch (err) {
            console.error(err);
            alert("Ошибка при обновлении профиля");
        } finally {
            setUploading(false);
        }
    };



    const removePhoto = () => setImage(null);

    const previewSource = image ? {uri: image} : userData?.imageUrl ? {uri: userData.imageUrl} : null;

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <Animated.View style={[styles.overlay, {opacity: opacityAnim}]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose}/>

                <Animated.View style={[styles.modal, {transform: [{scale: scaleAnim}]}]}>

                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Фото профиля</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="x" size={22} color="#666"/>
                        </TouchableOpacity>
                    </View>

                    {/* AVATAR PREVIEW */}
                    <View style={styles.avatarContainer}>
                        {previewSource ? (
                            <Image source={previewSource} style={styles.avatar}/>
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Icon name="user" size={40} color="#aaa"/>
                            </View>
                        )}
                    </View>

                    {/* ACTION BUTTONS */}
                    <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                        <Icon name="image" size={18} color="#4A90E2"/>
                        <Text style={styles.actionText}>Выбрать из галереи</Text>
                    </TouchableOpacity>

                    {image && (
                        <TouchableOpacity style={styles.deleteButton} onPress={removePhoto}>
                            <Icon name="trash-2" size={18} color="#e74c3c"/>
                            <Text style={styles.deleteText}>Удалить фото</Text>
                        </TouchableOpacity>
                    )}

                    {/* SAVE */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleUpload} disabled={uploading}>
                        {uploading ? <ActivityIndicator color="white"/> :
                            <Text style={styles.saveText}>Сохранить</Text>}
                    </TouchableOpacity>

                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center"
    },
    modal: {
        width: "88%",
        backgroundColor: "white",
        borderRadius: 18,
        padding: 22,
        elevation: 12
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },
    title: {
        fontSize: 20,
        fontWeight: "600"
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 25
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55
    },
    avatarPlaceholder: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        alignItems: "center"
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        gap: 10
    },
    actionText: {
        fontSize: 16,
        color: "#333"
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        gap: 10
    },
    deleteText: {
        color: "#e74c3c",
        fontSize: 16
    },
    saveButton: {
        backgroundColor: "#007AFF",
        marginTop: 20,
        padding: 14,
        borderRadius: 10,
        alignItems: "center"
    },
    saveText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    }
});
