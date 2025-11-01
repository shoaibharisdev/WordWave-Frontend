import { Button, Flex, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut, FiSearch } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill,  BsBell } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import Logo from "./Logo";

import { Heading } from "@chakra-ui/react";
const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	return (
		<Flex      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top="0"
      zIndex="1000"
      height="80px" // 👈 sets a proper fixed height
      px={6}        // padding for left/right space
	  pb={10}
	  pt={10}
      boxShadow="sm">
			{user && (
				<Link as={RouterLink} to='/'>
					<AiFillHome size={24} />
				</Link>
			)}
			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
					Login
				</Link>
			)}

			{/* <Image
				cursor={"pointer"}
				alt='logo'
				w={6}
				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
				onClick={toggleColorMode}
			/> */}
			<span style={{cursor:"pointer"}} onClick={toggleColorMode}>
			<Flex>
			<Logo colorMode={colorMode} onClick={toggleColorMode} />
			<Heading 
			fontSize={{ base: "larger", lg: "larger" }}
			>WordWave</Heading>
			</Flex>
			</span>
			{user && (
				<Flex alignItems={"center"} gap={4}>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
					{/*notification icon*/}
					<Link as={RouterLink} to={`/notification`}>
						<BsBell size={20} />
					</Link>

					<Link as={RouterLink} to={`/chat`}>
						<BsFillChatQuoteFill size={20} />
					</Link>
					<Link as={RouterLink} to={`/settings`}>
						<MdOutlineSettings size={20} />
					</Link>
					<Link as={RouterLink} to={'/search'}>
						<FiSearch size={20} />

					</Link>
					<Button size={"xs"} onClick={logout}>
						<FiLogOut size={20} />
					</Button>
				</Flex>
			)}

			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
					Sign up
				</Link>
			)}
		</Flex>
	);
};

export default Header;
