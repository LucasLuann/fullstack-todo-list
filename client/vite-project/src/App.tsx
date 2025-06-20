import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoList from "./pages/TodoList";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<h1>Página não encontrada</h1>} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tarefas" element={<TodoList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
