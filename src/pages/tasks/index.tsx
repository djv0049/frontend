import { useState } from "react";
import { AddTask } from "../../components/addTask";
import { Button } from "@mui/material";

const AddView = () => <AddTask />
const ManageView = () => <div>Manage Tasks (Edit/Delete) with search and filtering</div>;
const EditView = () => <div>Edit functionality coming soon</div>;
export function Tasks() {


  const ViewComponents = {
    AddView,
    ManageView,
    EditView
  };

  type View = keyof typeof ViewComponents;

  const [view, setView] = useState<View>("AddView");

  const SelectedView = ViewComponents[view];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <nav>
        {/* Update state with the correct view name */}
        <Button onClick={() => setView("AddView")}>New</Button>
        <Button onClick={() => setView("ManageView")}>Manage</Button>
        <Button onClick={() => setView("EditView")}>Edit</Button>
      </nav>

      <SelectedView />
    </div>
  )
}
