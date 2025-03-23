import Toolbar from "../components/Toolbar";
import {useAuth} from "../utils/AuthContext";
import FavoritesItem from "../components/FavoritesItem";

const FavoritesScreen = ({navigation}) => {
    const {userId} = useAuth();
    return <>
        <Toolbar title={'Mes favoris'} actions={[
            {
                icon: 'magnify', onPress: () => {
                }
            },
        ]}/>
        <FavoritesItem
            title="La toura Eiffel"
            type="Monument"
            description="Symbole emblématique de Paris. Symbole emblématique de Paris. Symbole emblématique de Paris. Symbole emblématique de Paris. Symbole emblématique de Paris. "
            onPress={() => console.log('Voir détail')}
            onViewMap={() => console.log('Voir carte')}
            onDelete={() => console.log('Supprimer le favori')}
        />
    </>
}

export default FavoritesScreen;