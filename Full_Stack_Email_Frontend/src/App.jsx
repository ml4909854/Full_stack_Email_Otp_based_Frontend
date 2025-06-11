import React from 'react'
import {BrowserRouter , Route , Routes} from "react-router-dom"
import Layout from './Layout/Layout'
import HOme from './components/Home/HOme'
import Blogs from './components/Blogs/Blogs'
import CreateBlog from './components/CreateBlogs/CreateBlog'
import Myblogs from './components/MyBlogs/Myblogs'
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'
import PrivateRoute from './components/PrivateRoute'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout/>}>
      <Route index element={<HOme/>}/>
      <Route path='/blog' element={<Blogs/>}/>
      <Route path="/create" element={<PrivateRoute>
          <CreateBlog/>
      </PrivateRoute>}/>
      <Route path='/myblog' element={<Myblogs/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      </Route>
      
    </Routes>
    
    </BrowserRouter>
    
  )
}

export default App