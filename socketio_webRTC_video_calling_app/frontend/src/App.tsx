import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LobbyScreen from "./screens/Lobby";
import RoomPage from "./screens/Room";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LobbyScreen />,
  },
  {
    path: "/room/:roomId",
    element: <RoomPage />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
