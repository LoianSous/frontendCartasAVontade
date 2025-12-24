export const LightTheme = {
  background: '#FFE7E7',
  container: '#FFFFFF',
  primary: '#B41513',
  text: '#B41513',
  inputBackground: '#FFFFFF',
  buttonBackground: '#FFFFFF',
  buttonText: '#B41513',
  circlebar: '#B41513',
  iconbar: '#FFFFFF'
};

export const DarkTheme = {
  background: '#121212',        // fundo principal (dark suave)
  container: '#1E1E1E',          // cards / telas internas
  primary: '#E53935',            // vermelho mais vivo
  text: '#F5F5F5',               // texto claro
  inputBackground: '#2A2A2A',    // inputs
  buttonBackground: '#E53935',   // botão com destaque
  buttonText: '#FFFFFF',         // texto do botão
  circlebar: '#2A2A2A',
  iconbar: '#FFFFFF',              // ícones claros
};

export const ElegantTheme = {
  background: '#F7F7F8',
  container: '#FFFFFF',
  primary: '#3B82F6', // azul moderno
  text: '#111827',
  inputBackground: '#F1F5F9',
  buttonBackground: '#3B82F6',
  buttonText: '#FFFFFF',
  circlebar: '#3B82F6',
  iconbar: '#111827',
};

export const YoungTheme = {
  background: '#0B0B0C',
  container: '#161618',
  primary: '#C7A17A', // dourado suave
  text: '#F4F4F5',
  inputBackground: '#1F1F22',
  buttonBackground: '#C7A17A',
  buttonText: '#0B0B0C',
  circlebar: '#C7A17A',
  iconbar: '#F4F4F5',
};

export const FuturisticTheme = {
  background: '#0F172A',
  container: '#020617',
  primary: '#38BDF8', // azul suave
  text: '#E5E7EB',
  inputBackground: '#020617',
  buttonBackground: '#38BDF8',
  buttonText: '#020617',
  circlebar: '#38BDF8',
  iconbar: '#E5E7EB',
};

export const MinimalTheme = {
  background: '#FDF4FF',
  container: '#FFFFFF',
  primary: '#A855F7', // lilás trend
  text: '#1F2937',
  inputBackground: '#FAE8FF',
  buttonBackground: '#A855F7',
  buttonText: '#FFFFFF',
  circlebar: '#A855F7',
  iconbar: '#1F2937',
};

export const ClassicTheme = {
  background: '#020617',
  container: '#020617',
  primary: '#22D3EE', // neon cyan
  text: '#E5E7EB',
  inputBackground: '#020617',
  buttonBackground: '#22D3EE',
  buttonText: '#020617',
  circlebar: '#A78BFA', // neon lilás
  iconbar: '#22D3EE',
};

export const themes = {
  light: LightTheme,
  dark: DarkTheme,
  elegant: ElegantTheme,
  young: YoungTheme,
  futuristic: FuturisticTheme,
  minimal: MinimalTheme,
  classic: ClassicTheme,
};

export type ThemeName = keyof typeof themes;
export type ThemeType = typeof LightTheme;
