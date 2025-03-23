import { Appbar } from 'react-native-paper';
import { Text, View } from 'react-native';
import {toolbarStyle} from "../styles/GlobalStyle";

const Toolbar = ({ title, onBack, actions = [] }) => (
    <Appbar.Header style={toolbarStyle.toolbar}>
        {onBack && <Appbar.BackAction  style={toolbarStyle.back} onPress={onBack} />}

        <View style={{ flex: 1 }}>
            <Text style={toolbarStyle.title}>{title}</Text>
        </View>

        {actions.map((action, index) => (
            <Appbar.Action key={index} icon={action.icon} onPress={action.onPress} />
        ))}
    </Appbar.Header>
);
export default Toolbar;