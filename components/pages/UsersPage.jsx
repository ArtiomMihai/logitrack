import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS } from "../../api";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadUsers = async (isRefreshing = false) => {
        try {
            if (!isRefreshing) {
                setLoading(true);
            }
            setError(null);

            // Получаем токен из AsyncStorage
            const token = await AsyncStorage.getItem("token");
            console.log("Токен:", token ? "Есть" : "Нет");

            if (!token) {
                setError("Токен авторизации не найден");
                return;
            }

            // Формируем URL для запроса
            const url = `${ENDPOINTS.GET_USERS}?page=0&limit=10`;
            console.log("URL запроса:", url);

            // Выполняем запрос
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Статус ответа:", res.status);

            // Проверяем статус ответа
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Не авторизован. Пожалуйста, войдите заново.");
                } else if (res.status === 403) {
                    throw new Error("Нет прав доступа");
                } else {
                    throw new Error(`Ошибка сервера: ${res.status}`);
                }
            }

            // Парсим ответ
            const data = await res.json();
            console.log("Полученные данные:", data);

            // Проверяем структуру данных
            if (data && data.content && Array.isArray(data.content)) {
                console.log(`Загружено пользователей: ${data.content.length}`);
                setUsers(data.content);

                // Информация о пагинации
                if (data.pagination) {
                    console.log("Пагинация:", data.pagination);
                }
            } else {
                console.warn("Неожиданная структура данных:", data);
                setUsers([]);
                if (data && Array.isArray(data)) {
                    // Если сервер вернул просто массив
                    setUsers(data);
                }
            }

        } catch (err) {
            console.error("Ошибка загрузки пользователей:", err);
            setError(err.message || "Произошла ошибка при загрузке");
            Alert.alert("Ошибка", err.message || "Не удалось загрузить пользователей");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Функция для обновления списка (pull-to-refresh)
    const onRefresh = () => {
        setRefreshing(true);
        loadUsers(true);
    };

    // Загружаем пользователей при монтировании компонента
    useEffect(() => {
        loadUsers();
    }, []);

    // Функция для получения иконки роли
    const getRoleIcon = (roleName) => {
        switch(roleName) {
            case 'DIRECTOR':
                return <MaterialIcons name="admin-panel-settings" size={16} color="#fff" />;
            case 'MANAGER':
                return <Ionicons name="person-outline" size={16} color="#fff" />;
            case 'EMPLOYEE':
                return <Ionicons name="person" size={16} color="#fff" />;
            default:
                return <Ionicons name="person-circle" size={16} color="#fff" />;
        }
    };

    // Если загрузка
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Загрузка пользователей...</Text>
            </View>
        );
    }

    // Если ошибка
    if (error) {
        return (
            <View style={styles.centerContainer}>
                <MaterialIcons name="error-outline" size={60} color="#ff3b30" />
                <Text style={styles.errorText}>❌ {error}</Text>
                <Text style={styles.retryText} onPress={() => loadUsers()}>
                    <Ionicons name="refresh" size={16} /> Нажмите, чтобы повторить
                </Text>
            </View>
        );
    }

    // Если нет пользователей
    if (!users || users.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="people-outline" size={60} color="#999" />
                <Text style={styles.emptyText}>📭 Нет пользователей для отображения</Text>
                <Text style={styles.retryText} onPress={() => loadUsers()}>
                    <Ionicons name="refresh" size={16} /> Обновить
                </Text>
            </View>
        );
    }

    // Рендерим каждого пользователя
    const renderItem = ({ item, index }) => (
        <View style={[styles.card, index === 0 && styles.firstCard]}>
            {/* Аватар с иконкой-заглушкой */}
            {item.imageUrl ? (
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.avatar}
                />
            ) : (
                <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person-circle" size={50} color="#007AFF" />
                </View>
            )}

            {/* Информация о пользователе */}
            <View style={styles.info}>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{item.fullName || 'Без имени'}</Text>
                    {item.isDeleted && (
                        <MaterialIcons name="block" size={16} color="#ff3b30" />
                    )}
                </View>

                {/* Роли */}
                <View style={styles.rolesContainer}>
                    {item.roleList && item.roleList.length > 0 ? (
                        item.roleList.map((role, idx) => (
                            <View key={idx} style={styles.roleBadge}>
                                {getRoleIcon(role.name)}
                                <Text style={styles.roleText}> {role.name}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noRole}>Нет роли</Text>
                    )}
                </View>

                {/* Контактные данные с иконками */}
                {item.phoneNumber && (
                    <View style={styles.infoRow}>
                        <Ionicons name="call-outline" size={14} color="#555" />
                        <Text style={styles.phone}> {item.phoneNumber}</Text>
                    </View>
                )}

                {item.email && (
                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={14} color="#555" />
                        <Text style={styles.email}> {item.email}</Text>
                    </View>
                )}

                {/* Персональный код с иконкой ID карты */}
                {item.personalCode && (
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="id-card" size={14} color="#888" />
                        <Text style={styles.personalCode}> {item.personalCode}</Text>
                    </View>
                )}
            </View>

            {/* Индикатор статуса */}
            <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: item.isDeleted ? '#ff3b30' : '#4cd964' }]} />
            </View>
        </View>
    );

    // Основной рендер с FlatList
    return (
        <FlatList
            data={users}
            keyExtractor={(item) => item.userId?.toString() || Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListHeaderComponent={
                <View style={styles.headerContainer}>
                    <Ionicons name="people" size={20} color="#007AFF" />
                    <Text style={styles.header}>
                        Всего пользователей: {users.length}
                    </Text>
                </View>
            }
            ListFooterComponent={
                users.length > 0 && (
                    <View style={styles.footerContainer}>
                        <MaterialIcons name="done-all" size={16} color="#999" />
                        <Text style={styles.footer}>
                            Конец списка
                        </Text>
                    </View>
                )
            }
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#f4f6f8",
        flexGrow: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 12,
    },
    header: {
        fontSize: 14,
        color: "#666",
        marginLeft: 6,
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    footer: {
        textAlign: 'center',
        color: '#999',
        marginLeft: 6,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    firstCard: {
        marginTop: 0,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
        borderWidth: 2,
        borderColor: "#007AFF",
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    info: {
        flex: 1,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        marginRight: 8,
    },
    rolesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 6,
    },
    roleBadge: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    roleText: {
        fontSize: 12,
        color: "#fff",
        fontWeight: '600',
        marginLeft: 4,
    },
    noRole: {
        fontSize: 12,
        color: "#999",
        fontStyle: 'italic',
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    phone: {
        fontSize: 14,
        color: "#555",
    },
    email: {
        fontSize: 14,
        color: "#555",
    },
    personalCode: {
        fontSize: 12,
        color: "#888",
    },
    statusContainer: {
        marginLeft: 8,
        alignSelf: 'flex-start',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        fontSize: 16,
        color: "#ff3b30",
        textAlign: "center",
        marginTop: 12,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 12,
        marginBottom: 12,
    },
    retryText: {
        fontSize: 16,
        color: "#007AFF",
        textAlign: "center",
        padding: 10,
    },
});