import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";

let user = true;

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<PrivateRoute user={user} />}>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:id" element={<Chat />} />
          </Route>

          <Route
            path="/login"
            element={
              <PrivateRoute user={!user} redirect="/">
                <Login />
              </PrivateRoute>
            }
          />







          <Route path="*" element={<NotFound/>}/> 
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
