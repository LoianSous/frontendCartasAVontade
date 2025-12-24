import { StyleSheet } from 'react-native';

export const Styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.container,
  },
  content: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 144,
    height: 144,
    marginBottom: 46,
  },
  title: {
    color: theme.text,
    fontSize: 35,
    textAlign: "center",
    marginBottom: 60,
    width: 300,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  titlemid: {
    color: "#B41513",
    fontSize: 25,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  buttonContainer: {
    paddingHorizontal: 100,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: theme.buttonText,
    fontSize: 20,
    fontWeight: '600',
  },
  buttoncadastro: {
    backgroundColor: theme.buttonBackground,
    borderRadius: 25,
    padding: 11,
  },
});