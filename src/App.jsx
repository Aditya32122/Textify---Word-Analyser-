import AskGemini from "./AskGemini";
import Aboutus from "./aboutus";
import Alert from "./Alert";
import Navbar from "./Navbar";
import Textform from "./Textform";
import Textarea from "./Textform"
import React,{ useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



function App() {

  const[mode,setMode] =useState('light');
  const[alert,setAlert] =useState(null);

  const showAlert=(message,type)=>{
    setAlert({
      msg:message,
      type:type
    })
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }

    const toggleMode = () => {
      if(mode==='light'){
        setMode('dark');
        document.body.style.backgroundColor='#042743';
        showAlert("Dark mode has been enabled","success");

      }else{
        setMode('light');
        document.body.style.backgroundColor = 'white';
        showAlert("Light mode has been enabled","success");
      }
    }


    
  return(
    <>
      <Router>
    <Navbar title="Textify" mode={mode} toggleMode={toggleMode} />
    <Alert alert={alert}/>
    <div className="container my-3">
        <Routes>
          {/* /users --> Component 1
            /users/home --> Component 2 */}
          <Route path="/about" element={<Aboutus mode={mode}/>} />
          <Route path="/" element={<Textform mode={mode} showAlert={showAlert} />} />
          <Route path="/AskGemini" element={<AskGemini mode={mode} showAlert={showAlert} />} />
        </Routes>
      </div>
      {/* <Textform mode={mode} showAlert={showAlert}/>
      <Aboutus/> */}
    </Router>
    </>
  ); 
}

export default App
