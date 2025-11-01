import { Box, Flex, Skeleton, useColorMode } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import TriangleSpinner from "../components/TriangleSpinner";
import { apiFetch } from "../utils/api";
import { Text, Button } from "@chakra-ui/react"


const HomePage = () => {
  const [showAll, setShowAll] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [topics, setTopics] = useState([]);
  const showToast = useShowToast();
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await apiFetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        // showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  useEffect(() => {
    const getTrending = async () => {
      try {
        setLoadingTopics(true);
        const res = await fetch("https://wordwave-ai-1.onrender.com/api/trending");
        const data = await res.json();

        if (data.error) {
          console.log(data.error);
          return;
        }

        // Update the topics state with the apiFetched data
        setTopics(data);
        setLoadingTopics(false);
        console.log("topics: " + topics);
      } catch (error) {
        console.log(error.message);
      }
    };

    getTrending();
  }, []);

  const searchTrending = async (topic) => {
    try {
      const res = await apiFetch(`/api/posts/search/${topic}`);
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setPosts(data);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  
   
  
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transitionDelay: 0.5 }}
    >
      <Flex gap="10" alignItems="flex-start">
     
      <Box
  flex={30}
  padding={8}
  position="sticky"
  top="80px"
  height="calc(100vh - 80px)"
  overflowY="auto"
  display={{
    base: "none",
    md: "block",
  }}
  bgGradient={colorMode === "dark"
    ? "linear(135deg, #0e0e10 0%, #14141a 50%, #1a1a25 100%)"
    : "linear(135deg, #f9fafb 0%, #edf2f7 50%, #e2e8f0 100%)"}
  borderLeft="1px solid"
  borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
  borderRadius="2xl"
  boxShadow={colorMode === "dark" 
    ? "0 4px 20px rgba(255, 255, 255, 0.03)" 
    : "0 4px 20px rgba(0, 0, 0, 0.05)"}
  backdropFilter="blur(8px)"
>

<Box mb={10}>
  <Text
    fontSize="xl"
    fontWeight="bold"
    mb={5}
    textAlign="left"
    bgGradient={
      colorMode === "dark"
        ? "linear(45deg, #00f5ff, #9d4edd)"
        : "linear(45deg, #2b6cb0, #805ad5)"
    }
    bgClip="text"
    textShadow={colorMode === "dark" ? "0 0 10px rgba(157, 78, 221, 0.4)" : "none"}
  >
    🔥 Trending Topics
  </Text>

  {loadingTopics ? (
    [1, 2, 3, 4, 5].map((i) => (
      <Skeleton
        key={i}
        height="50px"
        width="100%"
        my="8px"
        borderRadius="xl"
        opacity={colorMode === "dark" ? 0.25 : 0.6}
      />
    ))
  ) : (
    <>
      <Flex direction="column" gap={3}>
        {(showAll ? topics : topics.slice(0, 5)).map((topic, index) => (
          <Box
            key={index}
            p={4}
            borderRadius="2xl"
            cursor="pointer"
            bg={colorMode === "dark"
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(255, 255, 255, 0.9)"}
            backdropFilter="blur(12px)"
            border="1px solid"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
            _hover={{
              borderColor: colorMode === "dark" ? "#9d4edd" : "#805ad5",
              transform: "translateY(-3px)",
              boxShadow: colorMode === "dark"
                ? "0 6px 20px rgba(157, 78, 221, 0.15)"
                : "0 6px 20px rgba(128, 90, 213, 0.1)",
            }}
            transition="all 0.3s ease"
            onClick={() => searchTrending(topic.Topic)}
          >
            <Text
              fontSize="md"
              fontWeight="semibold"
              color={colorMode === "dark" ? "gray.100" : "gray.800"}
            >
              #{topic.Topic}
            </Text>
            {topic.count && (
              <Text
                fontSize="xs"
                color={colorMode === "dark" ? "gray.500" : "gray.600"}
                mt={1}
              >
                {topic.count} posts • Trending
              </Text>
            )}
          </Box>
        ))}
      </Flex>

      {/* Show More / Show Less Button */}
      {topics.length > 5 && (
        <Button
          size="sm"
          mt={4}
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          alignSelf="center"
          colorScheme={colorMode === "dark" ? "purple" : "blue"}
          _hover={{
            transform: "translateY(-2px)",
          }}
          transition="all 0.2s ease"
        >
          {showAll ? "Show Less ▲" : "Show More ▼"}
        </Button>
      )}
    </>
  )}
</Box>

<Box mt={10}>
  <Text
    fontSize="xl"
    fontWeight="bold"
    mb={5}
    bgGradient={
      colorMode === "dark"
        ? "linear(45deg, #00ff88, #00ccff)"
        : "linear(45deg, #38a169, #4299e1)"
    }
    bgClip="text"
    textShadow={
      colorMode === "dark"
        ? "0 0 10px rgba(0, 255, 136, 0.3)"
        : "none"
    }
  >
    ⚡ Quick Actions
  </Text>

  <Flex direction="column" gap={3}>
    {[
      { label: "Create Post", icon: "✨", path: "/create" },
      { label: "Discover People", icon: "👥", path: "/explore" },
      { label: "My Collections", icon: "📚", path: "/collections" },
    ].map((action, index) => (
      <Button
        key={index}
        size="sm"
        justifyContent="flex-start"
        height="45px"
        variant="ghost"
        onClick={() => (window.location.href = action.path)}
        bg={
          colorMode === "dark"
            ? "rgba(255, 255, 255, 0.04)"
            : "rgba(255, 255, 255, 0.9)"
        }
        border="1px solid"
        borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
        borderRadius="xl"
        backdropFilter="blur(10px)"
        _hover={{
          bg:
            colorMode === "dark"
              ? "rgba(0, 255, 136, 0.1)"
              : "rgba(56, 161, 105, 0.1)",
          borderColor: colorMode === "dark" ? "#00ff88" : "#38a169",
          transform: "translateY(-2px)",
          boxShadow:
            colorMode === "dark"
              ? "0 6px 20px rgba(0, 255, 136, 0.15)"
              : "0 6px 20px rgba(56, 161, 105, 0.1)",
        }}
        _active={{
          transform: "translateY(0)",
        }}
        transition="all 0.3s ease"
      >
        <Flex align="center" gap={3}>
          <Text fontSize="lg">{action.icon}</Text>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={colorMode === "dark" ? "gray.100" : "gray.800"}
          >
            {action.label}
          </Text>
        </Flex>
      </Button>
    ))}
  </Flex>
</Box>

{/* --- Footer --- */}
<Box
  pt={6}
  mt={10}
  borderTop="1px solid"
  borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
>
  <Text
    fontSize="xs"
    color={colorMode === "dark" ? "gray.400" : "gray.600"}
    mb={3}
    textAlign="center"
  >
    © 2024 WordWave — All rights reserved
  </Text>
  <Flex justify="center" gap={4} flexWrap="wrap">
    {["About", "Help", "Terms", "Privacy"].map((item, index) => (
      <Text
        key={index}
        fontSize="xs"
        color={colorMode === "dark" ? "gray.400" : "gray.600"}
        cursor="pointer"
        _hover={{
          color: colorMode === "dark" ? "#00f5ff" : "#2b6cb0",
          transform: "translateY(-1px)",
        }}
        transition="all 0.2s ease"
      >
        {item}
      </Text>
    ))}
  </Flex>
</Box>

</Box>


        <Box flex={70}>
          {!loading && posts.length === 0 && (
            <h1>Follow some users to see the feed</h1>
          )}

          {loading && (
            <Flex justify="center">
              <TriangleSpinner />
            </Flex>
          )}

          {posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
        </Box>
     <Box
  flex={30}
  padding={8}
  position="sticky"
  top="80px"
  height="calc(100vh - 80px)"
  overflowY="auto"
  display={{
    base: "none",
    md: "block",
  }}
  bgGradient={
    colorMode === "dark"
      ? "linear(135deg, #0e0e10 0%, #14141a 50%, #1a1a25 100%)"
      : "linear(135deg, #f9fafb 0%, #edf2f7 50%, #e2e8f0 100%)"
  }
  borderLeft="1px solid"
  borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
  borderRadius="2xl"
  boxShadow={
    colorMode === "dark"
      ? "0 4px 20px rgba(255, 255, 255, 0.03)"
      : "0 4px 20px rgba(0, 0, 0, 0.05)"
  }
  backdropFilter="blur(8px)"
>
  {/* --- Platform Analytics --- */}
  <Box mb={10}>
    <Text
      fontSize="xl"
      fontWeight="bold"
      mb={5}
      textAlign="left"
      bgGradient={
        colorMode === "dark"
          ? "linear(45deg, #00f5ff, #9d4edd)"
          : "linear(45deg, #2b6cb0, #805ad5)"
      }
      bgClip="text"
      textShadow={
        colorMode === "dark"
          ? "0 0 10px rgba(157, 78, 221, 0.4)"
          : "none"
      }
    >
      📊 Platform Analytics
    </Text>

    <Flex direction="column" gap={3}>
      {[
        { label: "Active Users", value: "12.4K", icon: "👥" },
        { label: "Posts Today", value: "3.2K", icon: "💬" },
        { label: "Trending Topics", value: topics.length, icon: "🔥" },
      ].map((stat, index) => (
        <Flex
          key={index}
          justify="space-between"
          align="center"
          p={4}
          borderRadius="2xl"
          bg={
            colorMode === "dark"
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(255, 255, 255, 0.9)"
          }
          border="1px solid"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          backdropFilter="blur(12px)"
          _hover={{
            borderColor: colorMode === "dark" ? "#00f5ff" : "#2b6cb0",
            transform: "translateY(-2px)",
            boxShadow:
              colorMode === "dark"
                ? "0 6px 20px rgba(0, 245, 255, 0.15)"
                : "0 6px 20px rgba(43, 108, 176, 0.1)",
          }}
          transition="all 0.3s ease"
        >
          <Flex align="center" gap={3}>
            <Text fontSize="lg">{stat.icon}</Text>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={colorMode === "dark" ? "gray.300" : "gray.700"}
            >
              {stat.label}
            </Text>
          </Flex>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color={colorMode === "dark" ? "white" : "gray.800"}
          >
            {stat.value}
          </Text>
        </Flex>
      ))}
    </Flex>
  </Box>

  {/* --- Suggested Users --- */}
  <SuggestedUsers />

  {/* --- Platform Updates --- */}
  <Box mt={10}>
    <Text
      fontSize="xl"
      fontWeight="bold"
      mb={5}
      bgGradient={
        colorMode === "dark"
          ? "linear(45deg, #00ff88, #00ccff)"
          : "linear(45deg, #38a169, #4299e1)"
      }
      bgClip="text"
      textShadow={
        colorMode === "dark"
          ? "0 0 10px rgba(0, 255, 136, 0.3)"
          : "none"
      }
    >
      🚀 What's New
    </Text>

    <Flex direction="column" gap={3}>
      {[
        {
          title: "🎤 Voice Spaces Live",
          desc: "Join live audio conversations with the community",
          color: "teal",
        },
        {
          title: "🏆 Achievement System",
          desc: "Earn badges for your contributions",
          color: "green",
        },
      ].map((item, index) => (
        <Box
          key={index}
          p={4}
          borderRadius="xl"
          bg={
            colorMode === "dark"
              ? `rgba(49, 151, 149, 0.1)`
              : `${item.color}.50`
          }
          borderLeft="4px solid"
          borderColor={`${item.color}.400`}
          transition="all 0.3s ease"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow:
              colorMode === "dark"
                ? `0 6px 20px rgba(49, 151, 149, 0.15)`
                : `0 6px 20px rgba(49, 151, 149, 0.1)`,
          }}
        >
          <Text fontSize="sm" fontWeight="semibold">
            {item.title}
          </Text>
          <Text
            fontSize="xs"
            color={colorMode === "dark" ? "gray.400" : "gray.600"}
          >
            {item.desc}
          </Text>
        </Box>
      ))}
    </Flex>
  </Box>
</Box>

        
      </Flex>
    </motion.div>
  );
};

export default HomePage;