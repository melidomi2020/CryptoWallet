import { useState } from "react";
import {
  Footer,
  Loader,
  Services,
  Transactions,
  Welcome,
  Navbar,
} from "./components/Index";

// import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <div className="min-h-screen">
        <div className="gradient-bg-welcome">
          <Navbar />
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
