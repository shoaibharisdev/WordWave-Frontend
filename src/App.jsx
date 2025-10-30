import { Box, Container, Spinner, useColorMode } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Logo from "./components/Logo";
import StartupLoader from "./components/StartupLoader";

function App() {
    const user = useRecoilValue(userAtom);
    const { pathname } = useLocation();
    const [isLoading, setIsLoading] = useState(true);
	const {colorMode,setColorMode}=useColorMode()
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Box position="relative" w="full">
            {isLoading ? (
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="rgba(255, 255, 255, 0.8)"
                >
                    <StartupLoader />
                </Box>
            ) : (
                <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
                    <Header />
                    <AnimatedRoutes />
                    {/* <Routes>
                        <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
                        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
                        <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
                        <Route
                            path="/:username"
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
                        <Route path="/:username/post/:pid" element={<PostPage />} />
                        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
                        <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
                    </Routes> */}
                </Container>
            )}
        </Box>
    );
}

export default App;
