
import Home from "./Pages/Home/Home";

import CreateChama from "./Components/Chamas/CreateChama";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import ChamasPage from "./Pages/ChamasPage/ChamasPage";
// import ProtectedRoute from './Components/ProtectedRoutes/ProtectedRoute';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/availableChamas' element={<ChamasPage />}/>
      <Route path="/createChama" element={<CreateChama />}/>
      
    </Routes>           
    </BrowserRouter>
   
  );
}

export default App;
