import RootLayout from './layouts/RootLayout';
import { AppContent } from './components/AppContent';
import { SearchSettingsProvider } from './context/SearchSettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/nord-theme.css';
import './styles/nord-prism.css';

export default function App() {
  return (
    <ThemeProvider>
      <SearchSettingsProvider>
        <RootLayout>
          <AppContent />
        </RootLayout>
      </SearchSettingsProvider>
    </ThemeProvider>
  );
}
