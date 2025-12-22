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
  titlemid: {
    color: "#B41513",
    fontSize: 25,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 100,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -80,
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
  templates: {
    backgroundColor: "#B41513",
    flex: 1,
    marginLeft:20,
    marginRight: 20,
    height: 200,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  texttemplate: {
    textAlign: 'center',
  },
  boxlink: {
    marginTop: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    backgroundColor: '#fff',
    width: 50,
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
  },
  share: {
    width: 50,
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
  },
  trash: {
    width: 50,
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
  },
  compartilhar: {
    position: 'absolute',
    top: 10,
    left: 290,
    zIndex: 10,
    marginTop: 30,
  },
  apagar: {
     position: 'absolute',
    top: -30,
    left: 290,
    zIndex: 10,
    marginTop: 30,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
    marginTop: 30,
  },
});