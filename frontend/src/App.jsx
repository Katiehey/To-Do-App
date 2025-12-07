import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
// Assuming you will create these components soon:
// import Tasks from './pages/Tasks';
// import Projects from './pages/Projects';
// import Calendar from './pages/Calendar';
// import Login from './pages/Login';

function App() {
  return (
    // 1. BrowserRouter must wrap all routing logic
    <Router>
      {/* 2. Routes component defines the routing area */}
      <Routes>
        {/* 3. The Layout route serves as the main structure */}
        <Route path="/" element={<Layout />}>
          
          {/* Default/Index route for the Layout (Home page) */}
          <Route index element={<Home />} />
          
          {/* Placeholder Routes (Uncomment/Add components when ready) */}
          {/* <Route path="/tasks" element={<Tasks />} /> */}
          {/* <Route path="/projects" element={<Projects />} /> */}
          {/* <Route path="/calendar" element={<Calendar />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
          
          {/* Catch-all route for any undefined paths (404 Page) */}
          <Route path="*" element={<NotFound />} />
        
        </Route>
      </Routes>
    </Router>
  );
}

export default App;