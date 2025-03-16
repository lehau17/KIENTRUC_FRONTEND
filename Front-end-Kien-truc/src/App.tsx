import { JSX } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import RegisterPage from "./pages/auth/Register";
import AuthLayout from "./layouts/auth/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = false;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth">
          <Route
            path="register"
            element={
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            }
          />
          <Route
            path="login"
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            }
          />
          {/* <Route path="register" element={<Register />} /> */}
          <Route
            path="change-password"
            element={
              <PrivateRoute>
                <>Test</>
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
