import Navigationbar from './components/navigationbar'
import AuthForm from './components/Authentication'; 
import Home from './components/Home';
import {
    Routes,
    Route,
    useLocation
   } from 'react-router-dom';
function App() {

  const isauthpath = ["/login", "/sign-up", "/auth"].includes(useLocation().pathname);

  return (
          <>
           {!isauthpath && <Navigationbar />}
             <Routes>
              <Route path="/" element={<AuthForm islogin = {true} />} />
              <Route path="/sign-up" element={<AuthForm islogin = {false} />} />
              <Route path="/login" element={<AuthForm islogin = {true} />} />
              <Route path="/home" element={<Home />} />
          </Routes>
          </>

          
  )
}

export default App
