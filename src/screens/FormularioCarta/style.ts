import { StyleSheet } from 'react-native';

export const Styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.container,
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
  title: {
    fontSize: 28,
    color: theme.text,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '400',
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 144,
    height: 144,
    marginBottom: 20,
  },
  form: {
    paddingHorizontal: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: theme.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#ccc',
    color: theme.text,
  },
  titleinputs: {
    color: theme.text,
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme.buttonBackground,
    paddingVertical: 15,
    paddingHorizontal: 30,
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
    color: theme.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  
photoBox: {
  width: 80,
  height: 80,
  backgroundColor: '#fff',
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#ccc',
},
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  photoWrapper: {
  position: 'relative',
  marginRight: 8,
  marginBottom: 8,
},

removePhotoButton: {
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: 'red',
  borderRadius: 12,
  width: 24,
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
},

});