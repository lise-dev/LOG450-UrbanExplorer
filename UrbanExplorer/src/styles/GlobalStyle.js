import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E0E0E0",
    },
    topSection: {
        flex: 2,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#E0E0E0",
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2E7D32",
        marginBottom: 30,
    },
    toolbarTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2E7D32",
    },
    inputContainer: {
        width: "90%",
        alignItems: "center",
        marginTop: 20,
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#A5D6A7",
        borderRadius: 25,
        backgroundColor: "#F5F5F5",
        marginBottom: 10,
        fontStyle: "italic",
        color: "#a7a7a7",
    },
    bottomSection: {
        flex: 3,
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: "center",
    },
    photoInput: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#A5D6A7",
        borderRadius: 25,
        backgroundColor: "#F5F5F5",
        marginBottom: 10,
    },
    photoInputText: {
        fontSize: 14,
        color: "#a7a7a7",
        fontStyle: "italic",
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    registerButton: {
        backgroundColor: "#2E7D32",
        paddingVertical: 12,
        paddingHorizontal: 60,
        borderRadius: 25,
        marginTop: 10,
        width: "90%",
    },
    registerText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    linkText: {
        color: "#388E3C",
        marginTop: 10,
        fontSize: 14,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#A5D6A7",
        borderRadius: 25,
        backgroundColor: "#FFFFFF",
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    googleButtonText: {
        color: "#757575",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    googleIcon: {
        width: 24,
        height: 24,
    },
    pickerContainer: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#A5D6A7",
        borderRadius: 25,
        backgroundColor: "#F5F5F5",
        marginBottom: 10,
        justifyContent: "center",
    },
    button: {
        backgroundColor: "#2E7D32",
        padding: 12,
        borderRadius: 25,
        marginTop: 0,
        width: "90%",
    },

    picker: {
        height: 50,
        width: "100%",
        color: "#757575",
    },
});

const toolbarStyle = StyleSheet.create({
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'transparent',
    },
    back: {
        // color: '#fff',
        fontSize: 20,
        marginRight: 8,
        fontWeight: 'bold',
    },
    title: {
        color: '#2E7D32',
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    actionsContainer: {
        flexDirection: 'row',
    },
    actionIcon: {
        // color: '#fff',
        fontSize: 20,
        marginLeft: 12,
    },
});

const typography = StyleSheet.create({
    // Titre
    titleLarge: {
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 32,
        color: '#1c1c1e',
    },
    titleMedium: {
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 28,
        color: '#1c1c1e',
    },
    titleSmall: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 24,
        color: '#1c1c1e',
    },

    // Texte principal
    bodyLarge: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'Roboto sans-serif',
        // color: '#3c3c43',
        color: '#1c1c1e',
    },
    bodyMedium: {
        fontSize: 15,
        lineHeight: 20,
        color: '#3c3c43',
    },
    bodySmall: {
        fontSize: 13,
        lineHeight: 16,
        color: '#3c3c43',
    },

    // les étiquettes
    labelLarge: {
        fontSize: 16,
        fontWeight: '500',
        color: '#6e6e73',
        letterSpacing: 0.5,
    },
    labelMedium: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6e6e73',
        letterSpacing: 0.5,
    },
    labelSmall: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6e6e73',
        letterSpacing: 0.25,
    },


    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: "center",
    }
});


export {styles, toolbarStyle, typography};