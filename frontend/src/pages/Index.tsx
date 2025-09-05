// Página inicial atualizada com o novo design

import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to the new Home page
  return <Navigate to="/" replace />;
};

export default Index;
