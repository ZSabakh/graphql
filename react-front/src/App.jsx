import "./App.css";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} exact />
        <Route path="/events" element={<Events />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/" element={<Navigate replace to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
