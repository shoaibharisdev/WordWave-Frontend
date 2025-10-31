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

const HomePage = () => {
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
        const res = await fetch("/api/posts/feed");
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

        // Update the topics state with the fetched data
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
      const res = await fetch(`/api/posts/search/${topic}`);
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
          padding={10}
          style={{
            marginLeft: "-6em",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
            }}
          >
            See what's trending
          </h1>
          {loadingTopics ? (
            [1,2,3,4,5].map((skeletons)=>{
              return (<Skeleton
              height="40px" // Adjust height as needed
              width="200px" // Adjust width as needed
              my="10px"
              borderRadius="10px" // Match the borderRadius with your content shape
            />)
            
            })
          
          ) : (
            topics.map((topic, index) => (
              <Box
                key={index}
                color={colorMode === "dark" ? "white" : "black"}
                borderRadius="full"
                paddingX={0}
                paddingY={2}
                fontSize="sm"
                fontWeight="medium"
                cursor="pointer"
                _focus={{ outline: "none" }}
                onClick={() => searchTrending(topic.Topic)}
              >
                #{topic.Topic}
              </Box>
            ))
          )}
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
          display={{
            base: "none",
            md: "block",
          }}
        >
          <SuggestedUsers />
        </Box>
        
      </Flex>
    </motion.div>
  );
};

export default HomePage;