import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFE7E7',
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
    color: "#B41513",
    fontSize: 35,
    textAlign: "center",
    marginBottom: 60,
    width: 300,
  },
  title2: {
    color: "#B41513",
    fontSize: 25,
    textAlign: "center",
    marginBottom: 60,
    width: 350,
  },
  buttonContainer: {
    paddingHorizontal: 100,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#B41513',
    fontSize: 20,
    fontWeight: '600',
  },
});