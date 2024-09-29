import { useState } from 'react'
import './App.css'
import Board from './components/Board';
import {Toaster} from 'react-hot-toast'

function App() {
  
  return (
    <>
      <Board/>
      <Toaster/>
    </>
  )
}

export default App
