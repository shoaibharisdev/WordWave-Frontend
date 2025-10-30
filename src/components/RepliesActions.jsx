import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import repliesAtom from "../atoms/repliesAtom";

const Actions = ({ reply }) => {
  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(reply.likes.includes(user?._id));
  const [likes, setLikes] = useState(reply.likes.length);
  const [replied, setReplied] = useState(reply.replies.length);
  const [replies, setReplies] = useRecoilState(repliesAtom);
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [nReply, setNReply] = useState("");

  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLikeAndUnlike = async () => {
    if (!user) {
      showToast("Error", "You must be logged in to like a reply", "error");
      return; // Exit early if user is not authenticated
    }
    if (isLiking) return; // Prevent multiple requests when one is already in progress
    setIsLiking(true);

    try {
      const response = await fetch(`/api/replies/like/${reply._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server responds with JSON
        showToast(
          "Error",
          errorData.error || "Failed to like/unlike the reply",
          "error"
        );
        return;
      }

      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // Update the local state based on the optimistic UI pattern or the server's response
      const updatedReplies = replies.map((p) => {
        if (p._id === reply._id) {
          return {
            ...p,
            likes: liked
              ? p.likes.filter((id) => id !== user._id)
              : [...p.likes, user._id],
          };
        }
        return p;
      });

      setReplies(updatedReplies);
      setLiked(!liked); // Toggle the 'liked' state based on the previous state
      setLikes(liked ? likes - 1 : likes + 1); // Increment or decrement the likes count
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLiking(false); // Ensure we can like/unlike again once the process is done
    }
  };

  const handleReply = async () => {
    if (!user) {
      showToast("Error", "You must be logged in to reply to a reply", "error");
      return;
    }
    if (isReplying) return;
    setIsReplying(true);

    try {
      const response = await fetch(`/api/replies/reply/${reply._id}`, {
        method: "PUT", // Changed from PUT to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: nReply }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server responds with JSON
        showToast("Error", errorData.error || "Failed to reply", "error");
        return;
      }

      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // Assuming 'replies' is a state holding the list of top-level replies
      const updatedReplies = replies.map((r) => {
        if (r._id === reply._id) {
          // This assumes 'data' is the newly added reply
          return { ...r, replies: [...r.replies, data.reply] };
        }
        return r;
      });

      setReplies(updatedReplies);
      showToast("Success", "Reply added successfully", "success");
      onClose();
      setNReply("");
      setReplied(replied + 1);
    } catch (error) {
      console.log(error.message);
      showToast("Error", error.message, "error");
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <Flex flexDirection="column">
      <Flex gap={3} my={2} onClick={(e) => e.stopPropagation()}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : ""}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={handleLikeAndUnlike}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          aria-label="Comment"
          color=""
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          onClick={onOpen}
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>

        <RepostSVG />
        <ShareSVG />
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          {replied} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          {likes} likes
        </Text>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input
                placeholder="Reply goes here.."
                value={nReply}
                onChange={(e) => setNReply(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              size={"sm"}
              mr={3}
              isLoading={isReplying}
              onClick={handleReply}
            >
              Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Actions;

const RepostSVG = () => {
  return (
    <svg
      aria-label="Repost"
      color="currentColor"
      fill="currentColor"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
    >
      <title>Repost</title>
      <path
        fill=""
        d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
      ></path>
    </svg>
  );
};

const ShareSVG = () => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this reply!",
          text: "Here’s something interesting.",
          url: window.location.href, // This could be a dynamic link to the current post or reply
        });
        showToast("Success", "Content shared successfully!", "success");
      } catch (error) {
        showToast("Error", "Failed to share content.", "error");
      }
    } else {
      showToast("Error", "Sharing is not supported on this device.", "error");
    }
  };
  return (
    <svg
      aria-label="Share"
      color=""
      fill="rgb(243, 245, 247)"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
      onClick={handleShare}
    >
      <title>Share</title>
      <line
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="22"
        x2="9.218"
        y1="3"
        y2="10.083"
      ></line>
      <polygon
        fill="none"
        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      ></polygon>
    </svg>
  );
};
