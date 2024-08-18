import { useRoutes, RouteObject } from 'react-router-dom';
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

  return <>{ element }</>;
};

export default App;
