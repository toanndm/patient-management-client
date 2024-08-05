import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./components/Home";
import { PatientListview } from "./components/PatientListview";
import { PatientDetail } from "./components/PatientDetail";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto p-10">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/patient" element={<PatientListview />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
