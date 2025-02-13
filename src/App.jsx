import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Pricing from "./Pages/pricing";
import Loc from "./Pages/Loc";


const App = () => {
  return (
    <Router>
      <div className=" bg-gray-100 min-h-screen"> 
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Loc />} />
          <Route path="/Pricing" element={<Pricing />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
