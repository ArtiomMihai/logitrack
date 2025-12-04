import { DataTable } from "react-native-paper";
import { Text, StyleSheet, View } from "react-native";

export default function OrderItem({
                                      name,
                                      brand,
                                      quantity,
                                      unitPrice,
                                      totalPrice,
                                      unitType
                                  }) {
    return (
        <DataTable.Row style={styles.row}>
            <DataTable.Cell style={styles.nameCell}>
                <View>
                    <Text style={styles.productName}>{name}</Text>
                    {brand && <Text style={styles.brand}>{brand}</Text>}
                </View>
            </DataTable.Cell>
            <DataTable.Cell numeric style={styles.qtyCell}>
                <Text style={styles.value}>{quantity} {unitType || "шт."}</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric style={styles.priceCell}>
                <Text style={styles.value}>{unitPrice?.toFixed(2)} MDL</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric style={styles.totalCell}>
                <Text style={styles.total}>{totalPrice?.toFixed(2)} MDL</Text>
            </DataTable.Cell>
        </DataTable.Row>
    );
}

const styles = StyleSheet.create({
    row: {
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    nameCell: {
        flex: 3,
    },
    productName: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
    brand: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    qtyCell: {
        flex: 1,
    },
    priceCell: {
        flex: 2,
    },
    totalCell: {
        flex: 2,
    },
    value: {
        fontSize: 14,
        color: "#555",
    },
    total: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
});