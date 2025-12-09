import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import Product from '../Product';
import { ENDPOINTS } from '../../api';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    // Пагинация
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
        hasMore: false
    });

    // Загрузка всех продуктов с пагинацией
    const fetchAllProducts = useCallback(async (page = 1, isRefresh = false) => {
        try {
            if (page === 1) {
                setError(null);
                if (!isRefresh) setLoading(true);
            } else {
                setLoadingMore(true);
            }

            console.log(`Загрузка страницы ${page}...`);

            // Добавляем параметры пагинации в URL
            const url = `${ENDPOINTS.GET_PRODUCTS}?page=${page - 1}&size=${pagination.limit}`;
            console.log('Запрос к API:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            console.log('Статус ответа:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log(`Получено продуктов: ${data.content?.length || 0}`);
            console.log('Пагинация:', data.pagination);

            // Форматируем продукты
            const formattedProducts = (data.content || []).map(item => ({
                id: item.id?.toString() || '',
                name: item.name || 'Без названия',
                brand: item.brand || 'Не указан',
                quantityInStock: item.quantityInStock || 0,
                unitPrice: parseFloat(item.unitPrice) || 0,
                typeOfUnit: item.typeOfUnit || 'PCS'
            }));

            // Обновляем состояние
            if (page === 1 || isRefresh) {
                // Первая страница или обновление
                setProducts(formattedProducts);
                setFilteredProducts(formattedProducts);
            } else {
                // Подгрузка следующей страницы
                setProducts(prev => [...prev, ...formattedProducts]);
                setFilteredProducts(prev => [...prev, ...formattedProducts]);
            }

            // Обновляем информацию о пагинации
            setPagination({
                page: data.pagination?.page || page,
                limit: data.pagination?.limit || 10,
                total: data.pagination?.total || 0,
                pages: data.pagination?.pages || 0,
                hasMore: page < (data.pagination?.pages || 0)
            });

        } catch (err) {
            console.error('Ошибка при загрузке продуктов:', err);
            if (page === 1) {
                setError(`Не удалось загрузить продукты: ${err.message}`);
            } else {
                Alert.alert('Ошибка', 'Не удалось загрузить дополнительные продукты');
            }
        } finally {
            if (page === 1) {
                setLoading(false);
                setRefreshing(false);
            }
            setLoadingMore(false);
        }
    }, [pagination.limit]);

    // Первоначальная загрузка
    useEffect(() => {
        fetchAllProducts(1);
    }, [fetchAllProducts]);

    // Обновление по pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAllProducts(1, true);
    }, [fetchAllProducts]);

    // Загрузка следующей страницы
    const loadMoreProducts = useCallback(() => {
        if (!loadingMore && pagination.hasMore) {
            console.log('Загрузка следующей страницы...');
            fetchAllProducts(pagination.page + 1);
        }
    }, [loadingMore, pagination, fetchAllProducts]);

    // Поиск по продуктам
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProducts(products);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = products.filter(product =>
                (product.name && product.name.toLowerCase().includes(query)) ||
                (product.brand && product.brand.toLowerCase().includes(query)) ||
                (product.id && product.id.toString().toLowerCase().includes(query)) ||
                (product.typeOfUnit && product.typeOfUnit.toLowerCase().includes(query))
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, products]);

    // Рендер каждого продукта
    const renderProduct = ({ item }) => (
        <Product
            id={item.id}
            name={item.name}
            brand={item.brand}
            quantityInStock={item.quantityInStock}
            unitPrice={item.unitPrice}
            typeOfUnit={item.typeOfUnit}
        />
    );

    // Ключ для FlatList
    const keyExtractor = (item) => `${item.id}_${item.name}`;

    // Рендер разделителя
    const renderSeparator = () => <View style={styles.separator} />;

    // Рендер футера (индикатор загрузки)
    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#2e7d32" />
                <Text style={styles.footerText}>Загрузка...</Text>
            </View>
        );
    };

    // Если идет загрузка первой страницы
    if (loading && pagination.page === 1) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2e7d32" />
                <Text style={styles.loadingText}>Загрузка продуктов...</Text>
            </View>
        );
    }

    // Если есть ошибка при первой загрузке
    if (error && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorTitle}>Ошибка загрузки</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => fetchAllProducts(1)}>
                    <Text style={styles.retryButtonText}>Повторить попытку</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Заголовок */}
            <View style={styles.header}>
                <Text style={styles.title}>Продукты</Text>
                <View style={styles.countContainer}>
                    <Text style={styles.count}>
                        {filteredProducts.length} из {pagination.total}
                    </Text>
                    <Text style={styles.pageInfo}>
                        Страница {pagination.page}/{pagination.pages}
                    </Text>
                </View>
            </View>

            {/* Поиск */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Поиск по названию, бренду или ID..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    clearButtonMode="while-editing"
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setSearchQuery('')}
                        style={styles.clearButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.clearButtonText}>×</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Статистика */}
            {pagination.total > 0 && (
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>
                        Всего продуктов: <Text style={styles.statsHighlight}>{pagination.total}</Text>
                    </Text>
                    {pagination.hasMore && (
                        <Text style={styles.statsText}>
                            Загружено: <Text style={styles.statsHighlight}>{products.length}</Text>
                        </Text>
                    )}
                </View>
            )}

            {/* Список продуктов */}
            <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={keyExtractor}
                ItemSeparatorComponent={renderSeparator}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreProducts}
                onEndReachedThreshold={0.3}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#2e7d32']}
                        tintColor="#2e7d32"
                        title="Обновление..."
                        titleColor="#666"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📦</Text>
                        <Text style={styles.emptyText}>
                            {searchQuery
                                ? `По запросу "${searchQuery}" ничего не найдено`
                                : 'Нет доступных продуктов'}
                        </Text>
                        {searchQuery && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery('')}
                                style={styles.clearSearchButton}
                            >
                                <Text style={styles.clearSearchButtonText}>Очистить поиск</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.listContent,
                    filteredProducts.length === 0 && styles.emptyListContent
                ]}
            />

            {/* Кнопка быстрой загрузки всех */}
            {pagination.hasMore && !loadingMore && (
                <TouchableOpacity
                    style={styles.loadAllButton}
                    onPress={loadMoreProducts}
                    activeOpacity={0.8}
                >
                    <Text style={styles.loadAllButtonText}>
                        ↓ Загрузить ещё (осталось {pagination.total - products.length})
                    </Text>
                </TouchableOpacity>
            )}

            {/* Индикатор загрузки внизу */}
            {loadingMore && (
                <View style={styles.bottomLoader}>
                    <ActivityIndicator size="small" color="#2e7d32" />
                    <Text style={styles.bottomLoaderText}>Загрузка...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    countContainer: {
        alignItems: 'flex-end',
    },
    count: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2e7d32',
        marginBottom: 4,
    },
    pageInfo: {
        fontSize: 12,
        color: '#6c757d',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    searchInput: {
        flex: 1,
        height: 48,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
        color: '#2c3e50',
    },
    clearButton: {
        marginLeft: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        fontSize: 24,
        color: '#6c757d',
        fontWeight: '300',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    statsText: {
        fontSize: 14,
        color: '#6c757d',
    },
    statsHighlight: {
        fontWeight: '600',
        color: '#2c3e50',
    },
    listContent: {
        paddingVertical: 8,
        paddingBottom: 80,
    },
    emptyListContent: {
        flexGrow: 1,
    },
    separator: {
        height: 8,
    },
    footerLoader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    footerText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#6c757d',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 24,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6c757d',
        fontWeight: '500',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#dc3545',
        marginBottom: 8,
    },
    errorText: {
        fontSize: 15,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    retryButton: {
        backgroundColor: '#28a745',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#28a745',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 20,
        opacity: 0.5,
    },
    emptyText: {
        fontSize: 17,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    clearSearchButton: {
        backgroundColor: '#6c757d',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    clearSearchButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    loadAllButton: {
        backgroundColor: '#2e7d32',
        marginHorizontal: 20,
        marginBottom: 10,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#2e7d32',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    loadAllButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    bottomLoader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    bottomLoaderText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#6c757d',
    },
});