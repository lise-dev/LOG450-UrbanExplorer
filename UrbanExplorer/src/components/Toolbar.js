import { Appbar } from 'react-native-paper';
import {StatusBar, Text, View} from 'react-native';
import {toolbarStyle} from "../styles/GlobalStyle";

const Toolbar = ({ title, onBack, actions = [] }) => (
    <Appbar.Header style={toolbarStyle.toolbar} >
        {onBack && <Appbar.BackAction icon="arrow-left" style={toolbarStyle.back} onPress={onBack} color={'#2E7D32'}/>}
        <Appbar.Content title={title} titleStyle={toolbarStyle.title}/>
        {actions.map((action, index) => (
            <Appbar.Action containerColor={'#e8f5e9'} color={'#2E7D32'} key={index} icon={action.icon} onPress={action.onPress} />
        ))}
    </Appbar.Header>
);
export default Toolbar;