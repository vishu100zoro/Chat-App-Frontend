import React, { useState } from 'react'
import Navigation from './components/Navigation'
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import { useSelector } from 'react-redux';
import { AppContext,socket } from './context/appContext';

const App = () => {

  const [rooms,setRooms]=useState([]);
  const [currentRoom,setCurrentRoom]=useState([]);
  const [members,setMembers]=useState([]);
  const [messages,setMessages]=useState([]);
  const [privateMemberMsg,SetPrivateMemberMsg]=useState({});
  const [newMessages,setNewMessages]=useState({});

  const user=useSelector((state)=>state.user)
  return (
    <div>
    <AppContext.Provider value={{socket,currentRoom,setCurrentRoom,members,setMembers,messages,setMessages,privateMemberMsg,SetPrivateMemberMsg,rooms,setRooms,newMessages,setNewMessages}}>
    <BrowserRouter>
      <Navigation/>
      <Routes>
        <Route path='/' element={<Home/>}/>
       {!user&&( <><Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/></>)}
        <Route path='/chat' element={<Chat/>}/>
      </Routes>
    </BrowserRouter>
    </AppContext.Provider>
    </div>
  )
}

export default App