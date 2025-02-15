import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Pricing from "./Pages/pricing";
import Loc from "./Pages/Loc";
import Registration from "./Pages/Registration";


const App = () => {
  return (
    <Router>
      <div className=" bg-gray-100 min-h-screen"> 
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Loc />} />
          <Route path="/Pricing" element={<Pricing />} />
          <Route path="/Registration" element={<Registration />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
