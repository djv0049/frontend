import { useState } from "react";
import { AddTask } from "../../components/addTask";
import { Button } from "@mui/material";

const AddView = () => <div><AddTask /></div>
const ManageView = () => <div>Manage View Content</div>;
export function Tasks() {


  const ViewComponents = {
    AddView,
    ManageView,
  };

  type View = keyof typeof ViewComponents;

  const [view, setView] = useState<View>("AddView");

  const SelectedView = ViewComponents[view];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <nav>
        {/* Update state with the correct view name */}
        <Button onClick={() => setView("AddView")}>TaskList</Button>
        <Button onClick={() => setView("ManageView")}>ManageView</Button>
      </nav>

      <SelectedView />
    </div>
  )
}
