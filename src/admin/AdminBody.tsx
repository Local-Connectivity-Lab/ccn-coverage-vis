import UserPage from "./UserPage";
import EditSite from "./EditSite";
import EditData from "./EditData";

interface AdminBodyProps {
  page: AdminPage;
}

export default function AdminBody(props: AdminBodyProps) {
  switch (props.page) {
    case "users":
      return <UserPage />;
    case "edit-site":
      return <EditSite />;
    case "edit-data":
      return <EditData />;
    default:
      return <h1>Error</h1>;
  }
}
