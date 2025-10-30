import React from "react";
import { Box, Flex, Text, Avatar, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";


const NotificationItem = ({ notification }) => {
  const renderNotificationMessage = () => {
    switch (notification.type) {
      case "follow":
        return `${notification.user.name} started following you`;
      case "like":
        return `${notification.user.name} liked your post`;
      case "reply":
        return `${notification.user.name} replied to your post`;
      default:
        return "You have a new notification";
    }
  };

  return (
    <Box p={4} borderBottom="1px" borderColor="gray.200">
      <Flex align="center">
        <Avatar name={notification.user.name} src={notification.user.avatar} size="sm" mr={3} />
        <Text fontSize="sm">
          <Link as={RouterLink} to={`/${notification.user.username}/post/${notification.post._id}`}>
            {renderNotificationMessage()}
          </Link>
        </Text>
      </Flex>
    </Box>
  );
};

export default NotificationItem;
