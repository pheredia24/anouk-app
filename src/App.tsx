import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./components/Splash";
import Welcome from "./components/Welcome";
import ProfileSelection from "./components/ProfileSelection";
import Exercise from "./components/Exercise";
import ExerciseList from "./components/ExerciseList";
import AdminPanel from "./components/AdminPanel";
import FinishScreen from "./components/FinishScreen";
import CreateSentence from "./components/CreateSentence";
import { Toaster } from "sonner";

export default function App() {
  return (
    <Router>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/profiles" element={<ProfileSelection />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/sentences" element={<ExerciseList />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/finish" element={<FinishScreen />} />
        <Route path="/create" element={<CreateSentence />} />
      </Routes>
    </Router>
  );
}
