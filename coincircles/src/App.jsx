
import Home from "./Pages/Home/Home";
import ChamaList from "./Components/Chamas/ChamaList";
import CreateChama from "./Components/Chamas/CreateChama";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import ProtectedRoute from './Components/ProtectedRoutes/ProtectedRoute';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/availableChamas' element={<ProtectedRoute><ChamaList /></ProtectedRoute>}/>
      <Route path="/createChama" element={<ProtectedRoute><CreateChama /></ProtectedRoute>}/>
      
    </Routes>           
    </BrowserRouter>
   
  );
}

export default App;
