import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	VStack,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
  import { useSetRecoilState } from "recoil";
  import authScreenAtom from "../atoms/authAtom";
  import useShowToast from "../hooks/useShowToast";
  import userAtom from "../atoms/userAtom";
  import { apiFetch } from "../utils/api";
  import { motion, useAnimation } from "framer-motion";
  import { useEffect } from "react";
  
  const Logo = ({ colorMode }) => {
	const controls = useAnimation();
  
	useEffect(() => {
	  const sequence = async () => {
		await controls.start("visible");
		await new Promise((resolve) => setTimeout(resolve, 2000));
		await controls.start("hidden");
		sequence();
	  };
  
	  sequence();
	}, [controls]);
  
	const fillColor = colorMode === 'dark' ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)";
	const strokeColor = colorMode === 'dark' ? "white" : "black";
  
	const pathVariants = {
	  hidden: {
		pathLength: 0,
		fill: `rgba(${colorMode === 'dark' ? '255, 255, 255, 0' : '0, 0, 0, 0'})`,
		transition: {
		  pathLength: {
			duration: 2,
			ease: "easeInOut",
			delay: 1
		  },
		  fill: {
			duration: 2,
			ease: "easeInOut",
			delay: 0
		  }
		}
	  },
	  visible: {
		pathLength: 1,
		fill: fillColor,
		transition: {
		  pathLength: {
			duration: 2,
			ease: "easeInOut"
		  },
		  fill: {
			duration: 2,
			ease: "easeInOut",
			delay: 2
		  }
		}
	  }
	};
  
	return (
	  <svg
		version="1.0"
		xmlns="http://www.w3.org/2000/svg"
		width="300px"
		height="150px"
		viewBox="0 0 125.000000 64.000000"
		preserveAspectRatio="xMidYMid meet"
	  >
		<motion.g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)">
		  <motion.path
			d="M190 512 c-48 -24 -60 -53 -60 -154 l0 -88 80 0 80 0 0 -104 c0 -119
	  8 -136 67 -136 38 0 77 34 210 183 37 42 58 57 77 57 l26 0 0 -104 c0 -119 8
	  -136 67 -136 39 0 69 27 204 177 l56 63 57 0 57 0 -3 128 -3 127 -35 3 c-19 2
	  -58 -1 -86 -8 -54 -12 -50 -8 -208 -178 -66 -72 -76 -63 -76 75 0 121 -2 123
	  -89 105 -59 -12 -62 -15 -215 -180 -67 -73 -76 -63 -76 79 l0 109 -47 0 c-27
	  0 -64 -8 -83 -18z"
			fill="none"
			stroke={strokeColor}
			strokeWidth="12"
			initial="hidden"
			animate={controls}
			variants={pathVariants}
		  />
		</motion.g>
	  </svg>
	);
  };
  
  export default function LoginCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const setUser = useSetRecoilState(userAtom);
	const [loading, setLoading] = useState(false);
  
	const [inputs, setInputs] = useState({
	  username: "",
	  password: "",
	});
	const showToast = useShowToast();
  
	const handleLogin = async () => {
	  setLoading(true);
	  try {
		const res = await apiFetch("/api/users/login", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify(inputs),
		});
		const data = await res.json();
		if (data.error) {
		  showToast("Error", data.error, "error");
		  return;
		}
		localStorage.setItem("user-threads", JSON.stringify(data));
		setUser(data);
	  } catch (error) {
		showToast("Error", error, "error");
	  } finally {
		setLoading(false);
	  }
	};
  
	return (
	  <Flex 
		minH={"100vh"}
		position="fixed"
		top={0}
		left={0}
		right={0}
		bottom={0}
		zIndex={1000}
		direction={{ base: "column", lg: "row" }}
	  >
		{/* Left Section - Logo and Description - DARK BACKGROUND */}
		<Flex
		  flex={1}
		  display={{ base: "none", lg: "flex" }}
		  bgGradient="linear(to-br, #0f0f0f, #2b2b2b)"
		  align={"center"}
		  justify={"center"}
		  p={12}
		  position="relative"
		  overflow="hidden"
		>
		  {/* Decorative background elements */}
		  <Box
			position="absolute"
			top="-10%"
			left="-10%"
			width="300px"
			height="300px"
			borderRadius="full"
			bgGradient="radial(blue.600, transparent)"
			opacity={0.1}
			filter="blur(60px)"
		  />
		  <Box
			position="absolute"
			bottom="-10%"
			right="-10%"
			width="400px"
			height="400px"
			borderRadius="full"
			bgGradient="radial(purple.600, transparent)"
			opacity={0.1}
			filter="blur(80px)"
		  />
  
		  <VStack spacing={12} maxW={"650px"} textAlign={"center"} zIndex={1}>
			<motion.div
			  initial={{ opacity: 0, scale: 0.8 }}
			  animate={{ opacity: 1, scale: 1 }}
			  transition={{ duration: 0.8, ease: "easeOut" }}
			>
			  <Logo colorMode="dark" />
			</motion.div>
			
			<motion.div
			  initial={{ opacity: 0, y: 30 }}
			  animate={{ opacity: 1, y: 0 }}
			  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
			>
			  <Heading
				fontSize={{ base: "5xl", lg: "7xl" }}
				color={"white"}
				mb={6}
				fontWeight="extrabold"
				letterSpacing="tight"
			  >
				WordWave
			  </Heading>
			</motion.div>
  
			<motion.div
			  initial={{ opacity: 0, y: 30 }}
			  animate={{ opacity: 1, y: 0 }}
			  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
			>
			  <Text
				fontSize={{ base: "xl", lg: "2xl" }}
				color={"gray.300"}
				lineHeight="tall"
				px={6}
				fontWeight="medium"
			  >
				Pakistan's 1st Natural Language Processing Powered Social Media Platform for Short Content Writers
			  </Text>
			</motion.div>
  
			<motion.div
			  initial={{ opacity: 0 }}
			  animate={{ opacity: 1 }}
			  transition={{ duration: 1, delay: 0.6 }}
			>
			  <Flex gap={8} mt={4}>
				<Box textAlign="center">
				  <Text fontSize="3xl" fontWeight="bold" color="blue.400">10K+</Text>
				  <Text fontSize="sm" color="gray.400">Active Users</Text>
				</Box>
				<Box textAlign="center">
				  <Text fontSize="3xl" fontWeight="bold" color="purple.400">50K+</Text>
				  <Text fontSize="sm" color="gray.400">Posts Created</Text>
				</Box>
				<Box textAlign="center">
				  <Text fontSize="3xl" fontWeight="bold" color="green.400">AI</Text>
				  <Text fontSize="sm" color="gray.400">Powered</Text>
				</Box>
			  </Flex>
			</motion.div>
		  </VStack>
		</Flex>
  
		{/* Right Section - Login Form - WHITE BACKGROUND */}
		<Flex 
		  flex={1} 
		  align={"center"} 
		  justify={"center"} 
		  bg={"white"}
		  p={{ base: 6, md: 10 }}
		  overflowY="auto"
		>
		  <Box w={"full"} maxW={"500px"}>
			<VStack spacing={8} align={"stretch"}>
			  <Box textAlign="center">
				<Heading 
				  fontSize={{ base: "3xl", md: "4xl" }} 
				  color={"gray.800"}
				  fontWeight="bold"
				  mb={2}
				>
				  Welcome Back
				</Heading>
				<Text color="gray.600" fontSize="lg">
				  Sign in to continue to WordWave
				</Text>
			  </Box>
  
			  <Box
				rounded={"2xl"}
				bg={"white"}
				boxShadow={"xl"}
				border="1px"
				borderColor="gray.100"
				p={{ base: 8, md: 10 }}
			  >
				<Stack spacing={6}>
				  <FormControl isRequired>
					<FormLabel color="gray.700" fontWeight="semibold" fontSize="sm">
					  Username
					</FormLabel>
					<Input
					  type="text"
					  value={inputs.username}
					  onChange={(e) =>
						setInputs((inputs) => ({ ...inputs, username: e.target.value }))
					  }
					  size="lg"
					  bg="gray.50"
					  color="gray.900"

					  border="2px"
					  borderColor="gray.200"
					  _hover={{ borderColor: "gray.300" }}
					  _focus={{ 
						borderColor: "blue.500", 
						boxShadow: "0 0 0 1px #3182ce",
						bg: "white" ,
						color: "gray.900"

					  }}
					  rounded="xl"
					/>
				  </FormControl>
  
				  <FormControl isRequired>
					<FormLabel color="gray.700" fontWeight="semibold" fontSize="sm">
					  Password
					</FormLabel>
					<InputGroup size="lg">
					  <Input
						type={showPassword ? "text" : "password"}
						value={inputs.password}
						onChange={(e) =>
						  setInputs((inputs) => ({ ...inputs, password: e.target.value }))
						}
						bg="gray.50"
						color="gray.900"

						border="2px"
						borderColor="gray.200"
						_hover={{ borderColor: "gray.300" }}
						_focus={{ 
						  borderColor: "blue.500", 
						  boxShadow: "0 0 0 1px #3182ce",
						  bg: "white",
						  color: "gray.900" 
						}}
						rounded="xl"
					  />
					  <InputRightElement h={"full"}>
						<Button
						  variant={"ghost"}
						  onClick={() => setShowPassword((s) => !s)}
						  _hover={{ bg: "gray.100" }}
						>
						  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
						</Button>
					  </InputRightElement>
					</InputGroup>
				  </FormControl>
  
				  <Stack spacing={6} pt={4}>
					<Button
					  loadingText="Logging in"
					  size="lg"
					  h="56px"
					  bgGradient="linear(to-r, gray.800, gray.900)"
					  color={"white"}
					  _hover={{
						bgGradient: "linear(to-r, gray.900, black)",
						transform: "translateY(-2px)",
						boxShadow: "lg"
					  }}
					  _active={{
						transform: "translateY(0)",
					  }}
					  transition="all 0.2s"
					  onClick={handleLogin}
					  isLoading={loading}
					  rounded="xl"
					  fontWeight="bold"
					  fontSize="md"
					>
					  Sign In
					</Button>
  
					<Text align={"center"} color="gray.600" fontSize="sm">
					  Don't have an account?{" "}
					  <Link 
						color={"blue.600"} 
						fontWeight="semibold"
						onClick={() => setAuthScreen("signup")}
						_hover={{ textDecoration: "underline" }}
					  >
						Create one now
					  </Link>
					</Text>
				  </Stack>
				</Stack>
			  </Box>
			</VStack>
		  </Box>
		</Flex>
	  </Flex>
	);
  }