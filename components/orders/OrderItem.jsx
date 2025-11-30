import {DataTable} from "react-native-paper";
import {Text} from "react-native";

export default function ({name,quantity,generalPrice,unitType}) {
    return(
        <DataTable.Row>
            <DataTable.Cell s>
                <Text>{name}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
                <Text>{quantity}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
                <Text>{generalPrice}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
                <Text>{unitType}</Text>
            </DataTable.Cell>
        </DataTable.Row>
    )
}