import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Spinner,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";
import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import TriangleSpinner from "../components/TriangleSpinner";

const SearchPage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(true);
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/rec/${user._id}`);
        const data = await res.json();
        console.log("Data", data)
        if (data.error) {
          // showToast("Error", data.error, "error");
          return;
        }
        const { Recommendations } = data;
        setPosts(Recommendations);
        console.log(Posts);
      } catch (error) {
        // showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [showToast, setPosts]);

  const handleSearch = async () => {
    setLoading(true);
    setPosts([]);
    setUsers([]);
    try {
      await searchUsers(); // Wait for searchUsers to complete before fetching posts
      const res = await fetch(`/api/posts/search/${query}`);
      const data = await res.json();
      if (data.error) {
        // showToast("Error", data.error, "error");
        return;
      }
      setPosts(data);
    } catch (error) {
      // showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      const res = await fetch(`/api/users/search/${query}`);
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setUsers(data);
      console.log(data);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch();
      searchUsers();
    }
  }, [debouncedQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transitionDelay: 0.5 }}
    >
      <div>
        <Input
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {users.length > 0 && (
        <Flex gap="10" alignItems="flex-start" mt={5}>
          <Box flex={30} key={user.id}>
            <h1>Suggested Users</h1>
            {users.length > 0 ? (
              users.map((user, index) => (
                <Flex key={user.id || index} py={2} alignItems="center">
                  <Avatar
                    src={user.profilePic}
                    alt={`${user.username}'s profile picture`}
                    style={{ marginRight: "0.5rem" }}
                  />
                  {user.username}
                </Flex>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </Box>
        </Flex>
      )}
      <Flex gap="10" alignItems="flex-start">
        <Box flex={70}>
          {!loading && posts.length === 0 && <h1>No Posts Available</h1>}
          {loading && (
            <Flex justify="center">
              <TriangleSpinner size="xl" />
            </Flex>
          )}
          <h1>Reccomended Posts</h1>
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
        ></Box>
      </Flex>
    </motion.div>
  );
};

export default SearchPage;
