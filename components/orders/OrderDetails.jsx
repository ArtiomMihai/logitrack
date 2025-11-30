import {DataTable} from "react-native-paper";
import {Text, StyleSheet} from "react-native";
import OrderItem from "./OrderItem";

const orderItems = [
    {name: "Хлеб", quantity: 1, generalPrice: 7, type: "Шт."},
    {name: "Молоко", quantity: 2, generalPrice: 40, type: "Литр"},
    {name: "Яйца", quantity: 12, generalPrice: 36, type: "Шт."},
];

export default function OrderDetails() {
    return (
        <DataTable>
            <DataTable.Header>
                <DataTable.Title style={styles.nameCol}>Название</DataTable.Title>
                <DataTable.Title style={styles.qtyCol}>Кол-во</DataTable.Title>
                <DataTable.Title style={styles.priceCol}>Общая стоимость</DataTable.Title>
                <DataTable.Title style={styles.typeCol}>Тип товара</DataTable.Title>
            </DataTable.Header>

            {orderItems.map((item, index) => (

                    <OrderItem key={index} name={item.name}
                               generalPrice={item.generalPrice}
                               quantity={item.quantity}
                               unitType={item.type}>
                    </OrderItem>

            ))}
        </DataTable>
    );
}

const styles = StyleSheet.create({
    nameCol: {flex: 3, justifyContent: "flex-start"},
    qtyCol: {flex: 1, justifyContent: "flex-end"},
    priceCol: {flex: 2, justifyContent: "flex-end"},
    typeCol: {flex: 1, justifyContent: "flex-end"},
});
