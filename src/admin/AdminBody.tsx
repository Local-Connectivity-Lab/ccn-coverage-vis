import UserPage from './UserPage';
import EditSite from './EditSite';
import EditData from './EditData';
import ListSites from './ListSites';

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
    case 'list-sites':
      return <ListSites />;
    default:
      return <h1>Error</h1>;
  }
}
