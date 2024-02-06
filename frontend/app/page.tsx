import UploadPage from "./uploadComponents/UploadPage";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./themes";
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <UploadPage />
    </ThemeProvider>
  );
}

export default App;