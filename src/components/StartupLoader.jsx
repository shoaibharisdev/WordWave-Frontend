import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const StartupLoader = ({ colorMode }) => {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // Forward animation
      await controls.start("visible");
      // Wait a bit before reversing to make it visible to the user
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for visibility
      // Reverse the animation
      await controls.start("hidden");
      // Recursive call to make the animation loop infinitely
      sequence();
    };

    sequence();
  }, [controls]);

  // Determine fill and stroke colors based on colorMode
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
          delay: 1 // Reduced delay for the pathLength animation in reverse
        },
        fill: {
          duration: 2, // Smooth transition to transparent
          ease: "easeInOut",
          delay: 0 // Start immediately, allowing fill to disappear first
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
          delay: 2 // Delay to allow pathLength animation to complete first
        }
      }
    }
  };

  return (
    <motion.svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="40vw"
      height="40vh"
      viewBox="0 0 125.000000 64.000000"
      preserveAspectRatio="xMidYMid meet"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.g
        transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
      >
        <motion.path
          d="M190 512 c-48 -24 -60 -53 -60 -154 l0 -88 80 0 80 0 0 -104 c0 -119
    8 -136 67 -136 38 0 77 34 210 183 37 42 58 57 77 57 l26 0 0 -104 c0 -119 8
    -136 67 -136 39 0 69 27 204 177 l56 63 57 0 57 0 -3 128 -3 127 -35 3 c-19 2
    -58 -1 -86 -8 -54 -12 -50 -8 -208 -178 -66 -72 -76 -63 -76 75 0 121 -2 123
    -89 105 -59 -12 -62 -15 -215 -180 -67 -73 -76 -63 -76 79 l0 109 -47 0 c-27
    0 -64 -8 -83 -18z"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          initial="hidden"
          animate={controls}
          variants={pathVariants}
        />
      </motion.g>
    </motion.svg>
  );
};

export default StartupLoader;
