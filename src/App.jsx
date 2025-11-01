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
    const { colorMode, setColorMode } = useColorMode();
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    // Check if we're on auth page
    const isAuthPage = pathname === "/auth";

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
                <>
                    {isAuthPage ? (
                        // Auth page without container - full width
                        <AnimatedRoutes />
                    ) : (
                        // Other pages with container and header
                        <Container 
                            maxW={
                                pathname === "/" 
                                    ? { base: "full", md: "1400px" } 
                                    : { base: "full", md: "620px" }
                            }
                            px={{ base: 2, md: 4 }}
                        >
                            <Header />
                            <AnimatedRoutes />
                        </Container>
                    )}
                </>
            )}
        </Box>
    );
}

export default App;