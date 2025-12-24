import { StyleSheet } from 'react-native';

export const Styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.container,
  },
  content: {
    flex: 1,
    backgroundColor: theme.background,
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
   color: theme.text,
    fontSize: 35,
    textAlign: "center",
  },
  titleinputs: {
    color: theme.text,
    fontSize: 25,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: theme.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  button2:{
    backgroundColor: theme.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
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
    marginTop: 50,
  },
  buttonContainer: {
    paddingHorizontal: 100,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: theme.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
  color: 'red',
  fontSize: 14,
  marginBottom: 10,
},
});