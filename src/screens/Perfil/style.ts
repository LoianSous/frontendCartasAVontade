import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFE7E7',
    marginBottom: -50,
  },
  profile:{
    backgroundColor: '#fff',
    borderRadius: 100,
    width: 150,
    height: 150,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  box:{
    width: 200,
    height: 200,
    borderWidth: 1,
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
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  info: {
    backgroundColor: '#fff',
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 25,
    height: 35,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gear: {
    backgroundColor: '#fff',
    width: 50,
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 300,
    zIndex: 10,
    marginTop: 30,
  },
  titlemid: {
    color: "#9d9d9dff",
    fontSize: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
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
  buttoncadastro: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 11,
  },
});