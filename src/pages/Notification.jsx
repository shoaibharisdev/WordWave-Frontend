import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Box, Heading } from "@chakra-ui/react";
import userAtom from "../atoms/userAtom";
import NotificationItem from "../components/NotificationItem";
import { apiFetch } from "../utils/api";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await apiFetch(`/api/notifications?userId=${user._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    getNotifications();

    console.log("Notifications: ", notifications);
  }, [user._id]);

  //   mark all notifications as read
  useEffect(() => {
    const markNotificationsRead = async () => {
      try {
        await apiFetch("/api/notifications/markAsRead", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id }),
        });
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    };

    markNotificationsRead();
  }, []);

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={5}
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading as="h1" size="lg" mb={4}>
        Notifications
      </Heading>
      {notifications.map((notification) => (
        <NotificationItem key={notification._id} notification={notification} />
      ))}
    </Box>
  );
};

export default Notification;
