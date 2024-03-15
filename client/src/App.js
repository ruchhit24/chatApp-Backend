 import React from 'react'
 import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Home from './pages/Home'
import Header from './components/Header'
 
 const App = () => {
   return (
      <>
        <BrowserRouter>
        <Header/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/chat/:id' element={<Chat/>}/>
            <Route path='/login' element={<Login/>}/>
          </Routes>
        </BrowserRouter>
      </>
   )
 }
 
 export default App