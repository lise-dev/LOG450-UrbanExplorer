import {Text, TouchableOpacity} from "react-native";
import React from "react";
import {typography, styles} from "../styles/GlobalStyle";

const Button = ({text, onPress}) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={typography.buttonText}>{text}</Text>
    </TouchableOpacity>);

export default Button;