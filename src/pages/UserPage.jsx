import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { motion } from "framer-motion";
import TriangleSpinner from "../components/TriangleSpinner";
import { apiFetch } from "../utils/api";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const handleTabChange = (tab) => setActiveTab(tab);

  useEffect(() => {
    // ✅ Only run when user is loaded and username exists
    if (!user || loading) return;

    const fetchData = async () => {
      setFetchingPosts(true);
      try {
        const endpoint =
          activeTab === "replies"
            ? `/api/replies/${username}`
            : `/api/posts/user/${username}`;

        const res = await apiFetch(endpoint);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch posts");
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    fetchData();
  }, [username, activeTab, user, loading, showToast, setPosts]);

  // ✅ Show spinner while loading user
  if (loading) {
    return (
      <Flex justifyContent={"center"}>
        <TriangleSpinner size={"xl"} />
      </Flex>
    );
  }

  // ✅ Handle user not found
  if (!user) return <h1>User not found</h1>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transitionDelay: 0.5 }}
    >
      <UserHeader
        user={user}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* No posts message */}
      {!fetchingPosts && posts.length === 0 && (
        <h1>User has no {activeTab === "posts" ? "posts" : "replies"}.</h1>
      )}

      {/* Loading spinner */}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <TriangleSpinner size={"xl"} />
        </Flex>
      )}

      {/* Posts / Replies */}
      {!fetchingPosts &&
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            postedBy={
              activeTab === "replies" ? post.postedBy._id : post.postedBy
            }
          />
        ))}
    </motion.div>
  );
};

export default UserPage;
