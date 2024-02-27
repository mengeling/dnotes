import "./styles/_index.css";
import { Note, SideNav } from "./components";

const App = () => {
  return (
    <div className="app-wrapper">
      <SideNav />
      <Note />
    </div>
  );
};

export default App;
