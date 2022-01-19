import UserPage from './UserPage';
import EditSite from './EditSite';

interface AdminBodyProps {
  page: AdminPage;
}

export default function AdminBody(props: AdminBodyProps) {
  switch (props.page) {
    case 'users':
      return <UserPage />;
    case 'edit-site':
      return <EditSite />;
    default:
      return <h1>Error</h1>;
  }
}
