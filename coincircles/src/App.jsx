import About from "./Pages/About";
import Home from "./Pages/Home/Home";
import ChamaList from "./Components/Chamas/ChamaList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/availableChamas' element={<ChamaList/>}/>
      
    </Routes>           
    </BrowserRouter>
   
  );
}

export default App;
