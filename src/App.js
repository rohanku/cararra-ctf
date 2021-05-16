import React from "react";
import "./App.css";
import "fontsource-roboto";
import { ThemeProvider } from "@material-ui/core/styles";

import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          Sorry! The website is down for maintenance. Message cararra or rohankk for links if necessary.
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
