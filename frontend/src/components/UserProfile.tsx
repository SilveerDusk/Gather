import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Avatar,
  Input,
  FormControl,
  FormLabel,
  Button,
  Stack,
  Text,
  IconButton,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { fetchUserWithString } from "../../lib/fetches";
import { editUser } from "../../lib/edits";

const vite_backend_url = "https://gather-app-307.azurewebsites.net";

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  // State to handle editing toggle
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    userId: "",
    username: "",
    firstName: "",
    lastName: "",
    userImage: "",
    userEmail: "",
  });
  // States to handle first name and last name editing
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");

  const { hasCopied, onCopy } = useClipboard(profileData.username);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user data using the provided userId
        const response = await fetchUserWithString(userId);
        if (response.ok) {
          // If response successful, parse the JSON data
          const data = await response.json();
          // Update state with fetched profile data
          setProfileData({
            userId: data._id,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            userImage: data.userImage,
            userEmail: data.email,
          });
          setEditedFirstName(data.firstName);
          setEditedLastName(data.lastName);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Function that handles clicking save changes
  const handleSaveChanges = async () => {
    try {
      const updatedProfile = {
        firstName: editedFirstName,
        lastName: editedLastName,
      };

      const response = await editUser(userId, updatedProfile);

      if (response.ok) {
        // If response is successful, spreads prev and sets firstname and lastname to updated values
        setProfileData((prev) => ({
          ...prev,
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
        }));
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Box bg="white" borderRadius="md" boxShadow="md" p={6} mb={4}>
      <Flex justifyContent="center" mb={4}>
        <Avatar
          size="2xl"
          name={profileData.username}
          src={`${vite_backend_url}/${userId}/avatar`}
        />
      </Flex>
      <Heading size="md" mb={4} alignSelf={"center"} textAlign={"center"}>
        {profileData.firstName} {profileData.lastName}'s Profile
      </Heading>
      {isEditing ? (
        <Stack spacing={4}>
          <FormControl id="first-name">
            <FormLabel>First Name</FormLabel>
            <Input
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
            />
          </FormControl>
          <FormControl id="last-name">
            <FormLabel>Last Name</FormLabel>
            <Input
              value={editedLastName}
              onChange={(e) => setEditedLastName(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="teal" mt={4} onClick={handleSaveChanges}>
            Save Changes
          </Button>
          <Button mt={2} onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Stack>
      ) : (
        <Stack spacing={4}>
          <Flex alignItems="center">
            <Text>
              <strong>Username:</strong> {profileData.username}
            </Text>
            <Tooltip
              label={hasCopied ? "Copied!" : "Copy"}
              closeOnClick={false}
              hasArrow
            >
              <IconButton
                size="sm"
                ml={2}
                icon={<CopyIcon />}
                onClick={onCopy}
                aria-label="Copy Username"
              />
            </Tooltip>
          </Flex>
          <Text>
            <strong>First Name:</strong> {profileData.firstName}
          </Text>
          <Text>
            <strong>Last Name:</strong> {profileData.lastName}
          </Text>
          <Text>
            <strong>Email:</strong> {profileData.userEmail}
          </Text>
          <Button colorScheme="teal" mt={4} onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default UserProfile;
