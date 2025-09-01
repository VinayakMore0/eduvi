import React from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { routerState } from "./state/atoms";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import CoursesPage from "./components/pages/CoursesPage";
import CreatorsPage from "./components/pages/CreatorsPage";
import AboutPage from "./components/pages/AboutPage";
import ContactPage from "./components/pages/ContactPage";

const AppRouter = () => {
  const currentPage = useRecoilValue(routerState);

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      case "courses":
        return <CoursesPage />;
      case "creators":
        return <CreatorsPage />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {renderPage()}
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <RecoilRoot>
      <AppRouter />
    </RecoilRoot>
  );
};

export default App;
