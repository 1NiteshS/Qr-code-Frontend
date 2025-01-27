import 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScanPage from './pages/ScanPage';
import DataPage from './pages/DataPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ScanPage />} />
        <Route path="/data" element={<DataPage />} />
      </Routes>
    </Router>
  );
};

export default App;