import { Text, TouchableOpacity, View, TouchableWithoutFeedback, Animated, Image } from "react-native";
import { StyleSheet } from "react-native";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRef, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS } from "../../api";


export default function MenuList({ visible, onClose }) {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const translateX = useRef(new Animated.Value(-300)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            loadUserProfile();
            // Анимация появления
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            // Анимация скрытия
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: -300,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    const loadUserProfile = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                navigation.navigate("Login");
                return;
            }

            const res = await fetch(ENDPOINTS.PROFILE, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigation = (screen) => {
        navigation.navigate(screen);
        onClose();
    };

    const handleProfilePress = () => {
        handleNavigation('Me');
    };

    return (
        <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View
                    style={[
                        styles.backdrop,
                        {
                            opacity: opacity,
                            display: visible ? 'flex' : 'none'
                        }
                    ]}
                />
            </TouchableWithoutFeedback>

            <Animated.View
                style={[
                    styles.sidebar,
                    {
                        transform: [{ translateX: translateX }],
                        opacity: opacity,
                    }
                ]}
            >
                {/* Шапка с фотографией профиля и данными пользователя */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleProfilePress}
                    style={styles.profileHeader}
                >
                    <View style={styles.profileInfo}>
                        <Image
                            source={{
                                uri: user?.imageUrl || 'https://via.placeholder.com/60'
                            }}
                            style={styles.profileImage}
                        />
                        <View style={styles.profileTextContainer}>
                            <Text style={styles.profileName}>
                                {user?.fullName || 'Загрузка...'}
                            </Text>
                            <Text style={styles.profileRole} numberOfLines={1}>
                                {user?.roleList?.map(r => r.name).join(", ") || 'Нет ролей'}
                            </Text>
                        </View>
                    </View>
                    <Feather name="chevron-right" size={20} color="#666" />
                </TouchableOpacity>

                {/* Разделитель */}
                <View style={styles.divider} />

                {/* Основное меню */}
                <View style={styles.container}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleNavigation('Order')}
                    >
                        <View style={styles.menuItem}>
                            <SimpleLineIcons name="notebook" size={28} color="#333" style={styles.icon}/>
                            <Text style={styles.text}>Список заявок</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleNavigation('Users')}
                    >
                        <View style={styles.menuItem}>
                            <SimpleLineIcons name="notebook" size={28} color="#333" style={styles.icon}/>
                            <Text style={styles.text}>Список сотрудников</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleNavigation("Shops")}
                    >
                        <View style={styles.menuItem}>
                            <AntDesign name="shop" size={28} color="#333" style={styles.icon}/>
                            <Text style={styles.text}>Магазины</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleNavigation("City")}
                    >
                        <View style={styles.menuItem}>
                            <FontAwesome5 name="city" size={24} color="black" style={styles.icon}/>
                            <Text style={styles.text}>Города</Text>
                        </View>
                    </TouchableOpacity>



                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleNavigation("Products")}
                    >
                        <View style={styles.menuItem}>
                            <Feather style={styles.icon} name="package" size={24} color="black" />
                            <Text style={styles.text}>Продукты</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        pointerEvents: 'box-none',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '80%',
        maxWidth: 300,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: '#e0e0e0',
    },
    profileTextContainer: {
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    profileRole: {
        fontSize: 12,
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        width: '100%',
    },
    container: {
        flexDirection: 'column',
        gap: 20,
        padding: 20,
        width: "100%",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
    icon: {
        marginRight: 20,
    },
    text: {
        fontSize: 14,
        color: "#424242",
        fontWeight: "500",
    },
});