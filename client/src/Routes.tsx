import { lazy, Suspense } from "react";
import { Navigate, Routes as RRRoutes, Route } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const NewChat = lazy(() => import("./pages/NewChat"));
const PublishedNews = lazy(() => import("./pages/PublishedNews"));
const Archive = lazy(() => import("./pages/Archive"));
const RecentChats = lazy(() => import("./pages/RecentChats"));
const Settings = lazy(() => import("./pages/Settings"));

const Routes = () => {
  const auth = useAuth();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RRRoutes>
        {!auth?.user ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<NewChat />} />
            <Route path="new" element={<NewChat />} />
            <Route path="chats" element={<Archive />} />
            <Route path="published-news" element={<PublishedNews />} />
            <Route path="recent" element={<RecentChats />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<>404 Not Found</>} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </RRRoutes>
    </Suspense>
  );
};

export default Routes;
