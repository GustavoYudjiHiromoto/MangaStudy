import { Routes, Route } from "react-router-dom";

// Pages (serão criadas nas próximas etapas)
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Study from "./pages/Study";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<h1 className="p-8 text-2xl font-bold">MangaStudy 🎌</h1>} />
        {/* Rotas serão adicionadas conforme as páginas forem criadas */}
      </Routes>
    </div>
  );
}

export default App;
