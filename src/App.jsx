import React from 'react'
import './App.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom'
import Layout from './Layout'
import Dashbord from './pages/Dashbord'
import ContextProvider from './context/IndexContext'
import Login from './pages/Login'
import Signup from './pages/Signup'


const isAuthenticated = () => {
  let token = localStorage.getItem("token");
  if (!token || token == "null" || token == "undefined") {
    return false;
  } else {
    return true;
  }
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

const PublicRoute = ({ element }) => {
  return isAuthenticated() ? <Navigate to="/dashbord" /> : element;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<PublicRoute element={<Login />} />} />
      <Route path="/sign-up" element={<PublicRoute element={<Signup />} />} />

      <Route path="/dashbord" element={<PrivateRoute element={<Layout />} />}>
        <Route index element={<Dashbord />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashbord" />} />
    </>
  )
)

function App() {
  console.log("web check 1")
  console.log("web check 2")
  console.log("web check 3")
  return (
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  )
}

export default App
