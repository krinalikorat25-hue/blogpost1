import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../Pages/HomePage";
import { CreatePostPage } from "../Pages/CreatePostPage";
import { LoginPage } from "../Pages/Loginpage";
import PostDetail from "./PostDetail";
import AuthGuard from "../guard/AuthGuard";
import NotFound from "../components/NotFound";
import  ExplorePost from "../Pages/ExplorePostPage";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <AuthGuard />, // protected layout
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/newpost",
        element: <CreatePostPage />,
      },
      {
        path: "explore",
        element: <ExplorePost />,
      },
      {
        path: "/posts/:postId",
        element: <PostDetail />,
      },
     
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
