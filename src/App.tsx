import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";

function App() {
  return (
    <>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/test' element={<div>테스트</div>} />
        </Routes>
    </>
  )
}

export default App
