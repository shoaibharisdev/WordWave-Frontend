import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Input,
  Avatar,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRecoilValue, useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import TriangleSpinner from "../components/TriangleSpinner";

const SearchPage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();

  // Debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedQuery = useDebounce(query, 500);

  // Fetch recommended posts on mount
  useEffect(() => {
    const getRecommendations = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/rec/${user._id}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          setPosts([]);
        } else {
          const { Recommendations = [] } = data;
          setPosts(Recommendations);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    getRecommendations();
  }, [user._id, showToast, setPosts]);

  // Unified search function
  const handleSearch = async () => {
    if (!debouncedQuery) return; // skip empty queries

    setLoading(true);
    setPosts([]);
    setUsers([]);

    try {
      // Search users
      const usersRes = await fetch(`/api/users/search/${debouncedQuery}`);
      const usersData = await usersRes.json();
      if (usersData.error) {
        showToast("Error", usersData.error, "error");
        setUsers([]);
      } else {
        setUsers(usersData || []);
      }

      // Search posts
      const postsRes = await fetch(`/api/posts/search/${debouncedQuery}`);
      const postsData = await postsRes.json();
      if (postsData.error) {
        showToast("Error", postsData.error, "error");
        setPosts([]);
      } else {
        setPosts(postsData || []);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
      setPosts([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on debounced query change
  useEffect(() => {
    handleSearch();
  }, [debouncedQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transitionDelay: 0.5 }}
    >
      {/* Search Input */}
      <Box mb={5}>
        <Input
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>

      {/* Suggested Users */}
      {users?.length > 0 && (
        <Flex gap="10" alignItems="flex-start" mb={5}>
          <Box flex={30}>
            <h1>Suggested Users</h1>
            {users.map((u, index) => (
              <Flex key={u.id || index} py={2} alignItems="center">
                <Avatar
                  src={u.profilePic}
                  alt={`${u.username}'s profile picture`}
                  mr={2}
                />
                {u.username}
              </Flex>
            ))}
          </Box>
        </Flex>
      )}

      {/* Posts Section */}
      <Flex gap="10" alignItems="flex-start">
        <Box flex={70}>
          <h1>Recommended Posts</h1>

          {loading && (
            <Flex justify="center" my={5}>
              <TriangleSpinner size="xl" />
            </Flex>
          )}

          {!loading && posts?.length === 0 && <p>No posts available.</p>}

          {posts?.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
        </Box>

        <Box
          flex={30}
          display={{ base: "none", md: "block" }}
        >
          {/* Right sidebar if needed */}
        </Box>
      </Flex>
    </motion.div>
  );
};

export default SearchPage;
