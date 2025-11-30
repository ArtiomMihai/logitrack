import { View, Text } from "react-native";
import Header from "./components/Header";
import Menu from "./components/Menu";
import { useState } from "react";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }
  return (
    <>
      <View>
        <Header toggleMenu={toggleMenu} />
        <View >
          <Text>Main content</Text>
        </View>
      </View>
      <Menu isOpen={isOpen} toggleMenu={toggleMenu} />
    </>

  );
}
