import React, { useState } from "react";
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
import ProfiloUtente from "./components/profile/ProfiloUtente";
import EditPost from "./components/editPost/editPost";
import UserList from "./components/userlist/userList";
import UserPosts from "./components/userposts/userPosts";
import DetailsPageUser from "./components/details/detailsPageUser";

function App() {
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem("avatar"));

  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<WelcomeArea />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/user-posts" element={<UserPosts />} />
        <Route path="/details-page-user/:id" element={<DetailsPageUser />} />

        <Route path="/login-user" element={<LoginUser userType="user" />} />
        <Route
          path="/login-company"
          element={<LoginUser userType="company" />}
        />
        <Route path="/details/:id" element={<DetailsPage />} />
        <Route
          path="/home-page-user"
          element={
            <HomePageUser avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
          }
        />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="/new-company" element={<CompanyForm />} />
        <Route path="/new-user" element={<UserForm />} />
        <Route path="/post-form" element={<PostForm />} />
        <Route
          path="/profile"
          element={<Profile setAvatarUrl={setAvatarUrl} />}
        />
        <Route
          path="/profilo-utente"
          element={<ProfiloUtente setAvatarUrl={setAvatarUrl} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
