import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";
import { motion } from "framer-motion";

const AuthPage = () => {
	const authScreenState = useRecoilValue(authScreenAtom);

	return <motion.div
	initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0, transitionDelay: 0.5}}
	>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</motion.div>;
};

export default AuthPage;
