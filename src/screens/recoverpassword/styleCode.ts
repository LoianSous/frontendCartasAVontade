import { StyleSheet } from 'react-native';

export const Styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.container,
  },
  linkpassword: {
    marginLeft: 160,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    marginTop: 30,
  },
  content: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 144,
    height: 144,
    marginBottom: 20,
  },
  title: {
    color: theme.text,
    fontSize: 35,
    textAlign: "center",
  },
  title2: {
    color: theme.text,
    fontSize: 25,
    textAlign: "center",
    marginTop: 50,
  },
  titleinputs: {
    color: theme.text,
    fontSize: 25,
    marginBottom: 10,
  },
  form: {
    marginLeft: 5,
    paddingHorizontal: 30,
    gap: 10,
    flexDirection: 'row',
  },
  input: {
    width: 50,
    height: 50,
    backgroundColor: theme.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#ccc',
    textAlign: 'center',
    color: theme.text,
  },
  button: {
    backgroundColor: theme.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonContainer: {
    paddingHorizontal: 60,
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