import UserPage from './UserPage';
import EditSite from './EditSite';
import EditData from './EditData';
import NewEditSite from './NewEditSite';

interface AdminBodyProps {
  page: AdminPage;
}

export default function AdminBody(props: AdminBodyProps) {
  switch (props.page) {
    case 'users':
      return <UserPage />;
    case 'edit-site':
      return <EditSite />;
    case 'edit-data':
      return <EditData />;
    case 'new-edit-site':
      return <NewEditSite />;
    default:
      return <h1>Error</h1>;
  }
}
