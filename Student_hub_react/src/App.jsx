import Navigationbar from './components/navigationbar'
import AuthForm from './components/Authentication'; 
import Home from './components/Home';
import {
   BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation
   } from 'react-router-dom';
function App() {

  const isauthpath = ["/login", "/sign-in", "/auth"].includes(useLocation().pathname);
  const Placeholder = () => {
      return <h1>home page</h1>
  };  

  return (
          <>
           {!isauthpath && <Navigationbar />}
             <Routes>
              <Route path="/auth" element={<Placeholder />} />
              <Route path="/sign-in" element={<AuthForm islogin = {false} />} />
              <Route path="/login" element={<AuthForm islogin = {true} />} />
              <Route path="/home" element={<Home />} />

          </Routes>
          </>

          
  )
}

export default App
