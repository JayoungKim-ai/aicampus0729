import TeamPage from "./pages/TeamPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TestPage from "./pages/TestPage";
import CounterPage from "./pages/CounterPage";
import TodoList from "./pages/TodoList";
import HealthChk from "./components/HealthChk";
import FestivalPage from "./pages/FestivalPage";
import FestivalDetailPage from "./pages/FestivalDetailPage";
import FestivalReviewWrite from "./pages/FestivalReviewWrite";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<TeamPage />} />
          <Route path="/counter" element={<CounterPage />} />
          <Route path="/todolist" element={<TodoList />} />
          <Route path="/festivals" element={<FestivalPage />} />
          <Route path="/festivals/:id" element={<FestivalDetailPage />} />
          <Route
            path="/festivals/review/:id"
            element={<FestivalReviewWrite />}
          />
          <Route path="/*" element={<TeamPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
