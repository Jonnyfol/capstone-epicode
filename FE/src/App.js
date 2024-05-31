import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/homePage/homePage";
import HomePageUser from "./components/homePageUser/homepageUser";
import LoginUser from "./components/loginpage/LoginUser";
import CompanyForm from "./components/NewAuthor/NewCompany";
import UserForm from "./components/NewAuthor/NewUser";
import PostForm from "./components/postForm/PostForm";
import WelcomeArea from "./components/WelcomeArea/WelcomeArea";
import DetailsPage from "./components/details/detailsPage";
import Profile from "./components/profile/Profilo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<WelcomeArea />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/home-page-user" element={<HomePageUser />} />
        <Route path="/login-user" element={<LoginUser userType="user" />} />
        <Route
          path="/login-company"
          element={<LoginUser userType="company" />}
        />
        <Route path="/details/:id" element={<DetailsPage />} />
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="/new-company" element={<CompanyForm />} />
        <Route path="/new-user" element={<UserForm />} />
        <Route path="/post-form" element={<PostForm />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
