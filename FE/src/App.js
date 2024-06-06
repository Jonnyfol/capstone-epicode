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

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/welcome" />;
};

function App() {
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem("avatar"));

  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<WelcomeArea />} />
        <Route path="/login-user" element={<LoginUser userType="user" />} />
        <Route
          path="/login-company"
          element={<LoginUser userType="company" />}
        />
        <Route path="/new-company" element={<CompanyForm />} />
        <Route path="/new-user" element={<UserForm />} />

        <Route
          path="/home-page"
          element={
            <ProtectedRoute>
              <HomePage avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home-page-user"
          element={
            <ProtectedRoute>
              <HomePageUser avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-posts"
          element={
            <ProtectedRoute>
              <UserPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details-page-user/:id"
          element={
            <ProtectedRoute>
              <DetailsPageUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details/:id"
          element={
            <ProtectedRoute>
              <DetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route
          path="/post-form"
          element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile setAvatarUrl={setAvatarUrl} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profilo-utente"
          element={
            <ProtectedRoute>
              <ProfiloUtente setAvatarUrl={setAvatarUrl} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
