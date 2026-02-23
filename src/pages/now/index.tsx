import { Button } from "@mui/material";
import { useState } from "react";
import { TaskList } from "../../components/taskList";

const TaskView = () => <div><TaskList/></div>
const DayView = () => <div>Day View Content</div>;
const WeekView = () => <div>Week View Content</div>;
const MonthView = () => <div>Month View Content</div>;

const ViewComponents = {
  TaskView,
  DayView,
  WeekView,
  MonthView,
};

type View = keyof typeof ViewComponents;

export function Now() {
  const [view, setView] = useState<View>("TaskView");

  const SelectedView = ViewComponents[view];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <nav>
        {/* Update state with the correct view name */}
        <Button onClick={() => setView("TaskView")}>TaskList</Button>
        <Button onClick={() => setView("DayView")}>DayView</Button>
        <Button onClick={() => setView("WeekView")}>WeekView</Button>
        <Button onClick={() => setView("MonthView")}>MonthView</Button>
      </nav>
      
      <SelectedView />
    </div>
  );
}

