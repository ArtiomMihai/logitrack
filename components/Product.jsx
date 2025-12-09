import {View} from "react-native";

export default function Product ({id,name,brand,quantityInStock,unitPrice,typeOfUnit}) {
    return (
        <View>
        <Text>{id}</Text>
        <Text>{name}</Text>
            <Text>{brand}</Text>
            <Text>{quantityInStock}</Text>
            <Text>{unitPrice}</Text>
            <Text>{typeOfUnit}</Text>
        </View>
    )
}