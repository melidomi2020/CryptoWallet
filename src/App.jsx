import { useState } from "react";
import {
  Footer,
  Loader,
  Services,
  Transactions,
  Welcome,
  NavBar,
} from "./components/Index";

// import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <div className="min-h-screen">
        <div className="gradient-bg-welcome">
          <NavBar />
          <Welcome />
        </div>
        <Services />
        <Transactions />
        <Footer />
      </div>
    </>
  );
};

export default App;
