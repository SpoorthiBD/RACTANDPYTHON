import logo from './logo.svg';
import './App.css';
import Home from './Pages/Home/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SingleProducts from './Pages/SingleProducts/SingleProducts1';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/SingleProducts/:productId" element={<SingleProducts />} />
        
   
      


        
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
