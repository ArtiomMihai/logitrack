import { StyleSheet, Animated} from "react-native";
import Profile from "./Profile";
import { useRef, useEffect } from "react";

export default function Menu({ isOpen,toggleMenu }) {
  const leftAnim = useRef(new Animated.Value(-260)).current;
  useEffect(() => {
    Animated.timing(leftAnim, {
      toValue: isOpen ? 0 : -260, 
      duration: 300, 
      useNativeDriver: false, 
    }).start();
  }, [isOpen]);

  return (
    <Animated.View style={[styles.main, { left: leftAnim }]}>
            <Profile toggleMenu={toggleMenu} /> 
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  main: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 2,
    zIndex: 1000,
    paddingTop: 34,
  },
});
