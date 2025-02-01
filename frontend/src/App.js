import './App.css';
// import { Routes,Route } from 'react-router-dom';
// import Home from './components/Home';
// import About from './components/About';
// import Create from './components/Create';
// import Navbar from './components/NavBar';


// function App() {
//   // const myWidth = 200;
//   // return (
//   //   <div className="App">
//   //     <Navbar 
//   //       drawerWidth={myWidth}
//   //       content={
//   //         <Routes>
//   //         <Route path="" element={<Home/>}/>
//   //         <Route path="/about" element={<About/>}/>
//   //         <Route path="/create" element={<Create/>}/>
//   //       </Routes>
//   //       }
//   //     />
     
//   //   </div>
//   // );
// }


import React from 'react'

import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import PrivateRoute from "./utils/privateRoute"
import { AuthProvider } from './context/AuthContext'

import Homepage from './views/Homepage'
import Registerpage from './views/Registerpage'
import Loginpage from './views/Loginpage'
import Database from './views/Database';
import Navbar from './views/navbar';
import ForgotPasswordPage from './views/ForgotPassword';



function App() {
  return (
    <Router>
      <AuthProvider>
        < Navbar/>
        <Switch>
          <PrivateRoute component={Database} path="/database" exact />
          <Route component={Loginpage} path="/login" />
          <Route component={Registerpage} path="/register" exact />
          <Route component={ForgotPasswordPage} path="/resetpassword" exact />
          <Route component={Homepage} path="/" exact />
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App