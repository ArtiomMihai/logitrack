import { DataTable } from "react-native-paper";
import { Text, StyleSheet } from "react-native";

const orderItems = [
    { name: "Хлеб", quantity: 1, generalPrice: 7, type: "Шт." },
    { name: "Молоко", quantity: 2, generalPrice: 40, type: "Литр" },
    { name: "Яйца", quantity: 12, generalPrice: 36, type: "Шт." },
];

export default function OrderDetails() {
    return (
        <DataTable>
            <DataTable.Header>
                <DataTable.Title style={styles.nameCol}>Название</DataTable.Title>
                <DataTable.Title  style={styles.qtyCol}>Кол-во</DataTable.Title>
                <DataTable.Title style={styles.priceCol}>Общая стоимость</DataTable.Title>
                <DataTable.Title style={styles.typeCol}>Тип товара</DataTable.Title>
            </DataTable.Header>

            {orderItems.map((item, index) => (
                <DataTable.Row key={index}>
                    <DataTable.Cell style={styles.nameCol}>
                        <Text>{item.name}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric style={styles.qtyCol}>
                        <Text>{item.quantity}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric style={styles.priceCol}>
                        <Text>{item.generalPrice}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.typeCol}>
                        <Text>{item.type}</Text>
                    </DataTable.Cell>
                </DataTable.Row>
            ))}
        </DataTable>
    );
}

const styles = StyleSheet.create({
    nameCol: { flex: 3, justifyContent: "flex-start" },          // Название слева
    qtyCol: { flex: 1, justifyContent: "flex-end" },             // Кол-во numeric справа
    priceCol: { flex: 2, justifyContent: "flex-end" },           // Общая стоимость numeric справа
    typeCol: { flex: 1, justifyContent: "flex-end" },            // Тип товара справа
});
