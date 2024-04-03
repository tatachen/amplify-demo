import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import Layout from './components/Layout/Layout';
import Arduino from './pages/Arduino/Arduino';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="arduino" element={<Arduino />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
