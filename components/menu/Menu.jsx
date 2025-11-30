import {StyleSheet, Animated, Dimensions} from "react-native";
import Profile from "./Profile";
import { useRef, useEffect } from "react";
import MenuList from "./MenuList";

export default function Menu({ isOpen, toggleMenu }) {
    const screenWidth = Dimensions.get("window").width;
    const menuWidth = screenWidth * 0.8;

    const leftAnim = useRef(new Animated.Value(-menuWidth)).current;

    useEffect(() => {
        Animated.timing(leftAnim, {
            toValue: isOpen ? 0 : -menuWidth,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isOpen, menuWidth]);

    return (
        <>
            <Animated.View style={[styles.main, { width: menuWidth, left: leftAnim }]}>
                <Profile toggleMenu={toggleMenu} />
                <MenuList />
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    main: {
        position: "absolute",
        top: 0,
        bottom: 0,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 6,
        borderRightWidth: 1,
        borderRightColor: "rgba(0,0,0,0.1)",
        paddingHorizontal: 16,
        zIndex: 1000,
    },
});
