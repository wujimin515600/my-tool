// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import '@ant-design/v5-patch-for-react-19';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './views/Layout'
// 尝试指定具体文件路径来解决找不到模块的问题，假设这些组件在 components 目录下对应的文件中
// import { HeaderPage } from '../components/HeaderPage'; 
// import { RowPage } from '../components/RowPage'; 
// import { SplitterPage } from '../components/SplitterPage';
import { RowPage, SplitterPage } from './components';
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<SplitterPage />} />
          {/* <Route path="/row" element={<RowPage />} /> */}
        </Route>
       
      </Routes>
    </Router>
  )
}

export default App
