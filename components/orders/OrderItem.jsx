import {DataTable} from "react-native-paper";
import {Text} from "react-native";

export default function (){
    return(
        <DataTable.Row>
            <DataTable.Cell s>
                <Text>Хлеб</Text>
            </DataTable.Cell>
            <DataTable.Cell>
                <Text>1</Text>
            </DataTable.Cell>
            <DataTable.Cell>
                <Text>8</Text>
            </DataTable.Cell>
            <DataTable.Cell>
                <Text>Шт.</Text>
            </DataTable.Cell>
        </DataTable.Row>
    )
}