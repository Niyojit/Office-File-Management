import Topbar from "./components/topbar/topbar";
import Sidebar from "./components/sidebar/sidebar";
import "./App.css";
import Home from "./pages/Home/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SheetData from "./components/sheetdata/Sheetdata";
import Dashboard from "./components/dashboard/Dashboard";
import Footer from "./components/footer/Footer";
import { Box } from "@mui/material";
import { useState } from "react";

function App() {
  const[isSidebarOpen, setSidebarOpen] = useState(false);

   const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
   };

  return (
    <Router>
      <Topbar onMenuClick={toggleSidebar}/>
      <Box display="flex" flex=''>

        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar}/>
        <Box className="content" flexGrow={1}>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard/>}/> 
           <Route path="/reports" element={<SheetData/>}/> 
        </Routes>
        </Box>
      </Box>
      <Footer/>
      
    
    </Router>
  );
}

export default App;
