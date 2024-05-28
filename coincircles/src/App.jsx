
import Home from "./Pages/Home/Home";
import ChamaList from "./Components/Chamas/ChamaList";
import CreateChama from "./Components/Chamas/CreateChama";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/availableChamas' element={<ChamaList/>}/>
      <Route path="/createChama" element={CreateChama} />
      
    </Routes>           
    </BrowserRouter>
   
  );
}

export default App;
