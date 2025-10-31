import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "../pages/UserPage";
import PostPage from "../pages/PostPage";
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";
import UpdateProfilePage from "../pages/UpdateProfilePage";
import CreatePost from "../components/CreatePost";
import ChatPage from "../pages/ChatPage";
import { SettingsPage } from "../pages/SettingsPage";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { AnimatePresence } from "framer-motion";
import SearchPage from "../pages/SearchPage";
import TestLoader from "../pages/TestLoader";
import Notification from "../pages/Notification";

const AnimatedRoutes = () => {
    const user = useRecoilValue(userAtom);
    const location = useLocation();
  return (
    <AnimatePresence>
    <Routes location={location} key={location.pathname}>
					<Route path='/' element={user ? <HomePage /> : <Navigate to='/auth' />} />
					<Route path='/test' element={<TestLoader />} />
					<Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />
					<Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />
					<Route path='/search' element={user ? <SearchPage /> : <Navigate to='/auth' />} />
					<Route path='/notification' element={user ? <Notification /> : <Navigate to='/auth' />} />

					<Route
						path='/:username'
						element={
							user ? (
								<>
									<UserPage />
									<CreatePost />
								</>
							) : (
								<UserPage />
							)
						}
					/>
					<Route path='/:username/post/:pid' element={<PostPage />} />
					<Route path='/chat' element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
					<Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
				</Routes>
                </AnimatePresence>
  )
}

export default AnimatedRoutes