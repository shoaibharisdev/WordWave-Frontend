import { Avatar, Divider, Flex, Text, Box } from "@chakra-ui/react";
import RepliesActions from "./RepliesActions";

const Comment = ({ reply, lastReply }) => {
  const formatDateToNow = (date) => {
    const now = new Date();
    const diff = now - date;

    if (diff < 1000) {
      return "just now";
    } else if (diff < 60 * 1000) {
      return Math.floor(diff / 1000) + "s";
    } else if (diff < 60 * 60 * 1000) {
      return Math.floor(diff / (60 * 1000)) + "m";
    } else if (diff < 24 * 60 * 60 * 1000) {
      return Math.floor(diff / (60 * 60 * 1000)) + "h";
    } else if (diff < 30 * 24 * 60 * 60 * 1000) {
      return Math.floor(diff / (24 * 60 * 60 * 1000)) + "d";
    } else if (diff < 12 * 30 * 24 * 60 * 60 * 1000) {
      return Math.floor(diff / (30 * 24 * 60 * 60 * 1000)) + "mo";
    } else {
      return Math.floor(diff / (12 * 30 * 24 * 60 * 60 * 1000)) + "y";
    }
  };
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize="sm" fontWeight="bold">
              {reply.username}
            </Text>
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
        {
          // if created at exists
          reply.createdAt && (
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"xs"} color={"gray.light"}>
                {formatDateToNow(new Date(reply.createdAt))} ago
              </Text>
            </Flex>
          )
        }
      </Flex>
      {/* actions like like, reply, retweet, share */}
      <Flex gap={3} my={1}>
        <RepliesActions reply={reply} />
      </Flex>
      {/* render reply to replies */}
      {reply.replies.map((reply) => (
        <Flex gap={4} py={2} my={2} w={"full"}>
          <Avatar src={reply.userProfilePic} size={"sm"} />
          <Flex gap={1} w={"full"} flexDirection={"column"}>
            <Flex
              w={"full"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Text fontSize="sm" fontWeight="bold">
                {reply.username}
              </Text>
            </Flex>
            <Text>{reply.text}</Text>
          </Flex>
          {
            // if created at exists
            reply.createdAt && (
              <Flex gap={2} alignItems={"center"}>
                <Text fontSize={"xs"} color={"gray.light"}>
                  {formatDateToNow(new Date(reply.createdAt))} ago
                </Text>
              </Flex>
            )
          }
        </Flex>
      ))}
      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;
