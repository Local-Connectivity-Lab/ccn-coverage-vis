import QRCode from './QRCode';
import EditSite from './EditSite';

interface AdminBodyProps {
  page: AdminPage;
}

export default function AdminBody(props: AdminBodyProps) {
  switch (props.page) {
    case 'qrcode':
      return <QRCode />;
    case 'edit-site':
      return <EditSite />;
    default:
      return <h1>Error</h1>;
  }
}
