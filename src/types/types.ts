export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  FormularioCarta: { letterTitle: string };
  Conclusao: { shareLink: string, share_url: string, };
  ConfirmPassword: undefined;
  Recover: undefined;
  Code: undefined;
  Alter: undefined;
  Configuracao: undefined;
  EditarCartas: {letterId : number, shareLink: string, share_url: string, };
  MainTabs: {
    screen?: "Usuario" | "MinhasCartas";
  } | undefined;
};


export type TabParamList = {
  Usuario: undefined,
  MinhasCartas: undefined,
  Perfil: undefined,
}