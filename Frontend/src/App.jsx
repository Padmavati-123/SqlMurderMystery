import { Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import TopicsPage from "./Components/Topics";
import QuizPage from "./Components/Questions";
import GroupByExplanation from "./GroupBy";
import DescriptionPage from "./Components/Description";
function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={< Home />} />
        <Route path="/topics" element={< TopicsPage />} />
        <Route path="/quiz/:topicId" element={<QuizPage />} />
        <Route path="/groupby" element={<GroupByExplanation />} />
        <Route path="/description/:topicId" element={<DescriptionPage />} />
      </Routes>
    </div>
  );
}

export default App;