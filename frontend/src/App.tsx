import { Routes, Route, Link } from "react-router-dom";
import MyTripsPage from "./pages/MyTripsPage";
import CreateTripPage from "./pages/trips/CreateTripPage";
import TripDetailsPage from "./pages/TripDetailsPage";

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="container">
          <h1>Pokémon Trip Planner</h1>
          <nav>
            <Link to="/">My Trips</Link>
            <Link to="/trips/new">Create Trip</Link>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<MyTripsPage />} />
            <Route path="/trips/new" element={<CreateTripPage />} />
            <Route path="/trips/:id" element={<TripDetailsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
