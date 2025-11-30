import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import MenuList from "./MenuList";

export default function Header({ toggleMenu }) {


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu}>
        <AntDesign name="align-left" size={36} color="black" />
      </TouchableOpacity>
      <View>
        <Text style={styles.text}>LogiTrack</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 34,
    width: 100 + '%',
    height: 88,
    backgroundColor: "#A7A7A7",
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 24,
  },
});
