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
  logo: {
    width: 144,
    height: 144,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingBottom: 0,
  },
  form: {
    paddingHorizontal: 30,
  },
  title: {
   color: "#B41513",
    fontSize: 35,
    textAlign: "center",
  },
  titleinputs: {
    color: "#B41513",
    fontSize: 25,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonContainer: {
    paddingHorizontal: 100,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#B41513',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
  color: 'red',
  fontSize: 14,
  marginBottom: 10,
},
});