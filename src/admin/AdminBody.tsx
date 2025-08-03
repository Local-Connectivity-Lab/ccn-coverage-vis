import UserPage from './UserPage';
import EditSite from './EditSite';
import EditData from './EditData';
import ListSites from './ListSites';
import CreateEditSite from './CreateEditSite';

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
    case 'create-site':
      return <CreateEditSite />;
    case 'new-edit-site':
      return <CreateEditSite />;
    default:
      return <h1>Error</h1>;
  }
}
