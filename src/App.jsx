import './App.css'
import CallMyDoctorWidget from './components/CallMyDoctorWidget';
import VerticalBtn from "./components/VerticalBtn";
import { useState, useEffect } from 'react';
import SideBar from "./components/SideBar"


function App() {

 const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  // ESC to close
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);




  return (
    <>
    <h4 style={{textAlign: 'center', fontSize: "26px", fontWeight: "bold"}}>Keep main page here.</h4>
      <CallMyDoctorWidget/>
{!open ? <VerticalBtn
  label="Need A Nurse ? (Select Package)"
  top="25%"    // 👈 change this — lower % = higher on screen
  toggle={toggle}
/> : null}      
 <SideBar open={open} onClose={close}  />
    </>
  )
}

export default App
