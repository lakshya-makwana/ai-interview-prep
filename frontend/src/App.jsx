import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Resume from "./pages/Resume";
import Analysis from "./pages/Analysis";

import ProtectedRoute from "./components/ProtectedRoute";
import CodingPractice from "./pages/CodingPractice";
import CodingProblem from "./pages/CodingProblem";
import CodingProgress from "./pages/CodingProgress";
import CodingFavorites from "./pages/CodingFavorites";
import CodingSubmissions from "./pages/CodingSubmissions";
import CodingSubmissionDetail from "./pages/CodingSubmissionDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <Resume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coding"
          element={
            <ProtectedRoute>
              <CodingPractice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coding/progress"
          element={
            <ProtectedRoute>
              <CodingProgress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coding/favorites"
          element={
            <ProtectedRoute>
              <CodingFavorites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coding/submissions"
          element={
            <ProtectedRoute>
              <CodingSubmissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coding/submissions/:id"
          element={
            <ProtectedRoute>
              <CodingSubmissionDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coding/:slug"
          element={
            <ProtectedRoute>
              <CodingProblem />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
