import { useRoutes, RouteObject } from 'react-router-dom';
import { ModeProvider } from '@/common/context';
import Home from "@/pages/Home";

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/:id',
    element: <Home />,
  }

] as RouteObject[];


const App = () => {
  const element = useRoutes(routes);

  return <ModeProvider>{ element }</ModeProvider>;
};

export default App;
