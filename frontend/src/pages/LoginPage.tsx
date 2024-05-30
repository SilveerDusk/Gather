import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Box,
  Link,
  Flex,
  Text,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { loginUser } from "../../lib/fetches";

const LoginPage = ({ updateState }: { updateState: any }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("submitting form");
    if (username === "" || password === "") {
      alert("Please fill out all fields");
      return;
    } else {
      try {
        const res = await loginUser({ username, password });
        if (res.status === 200) {
          const data = await res.json();
          updateState.setToken(data.token);
          updateState.setUser(data.existingUser);
          localStorage.setItem("token", data.token);
          console.log("Login successful!");
          navigate("/");
        } else {
          const err = await res.text();
          console.log("Login failed:", err);
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      p={{ base: 4, md: 0 }}
      minHeight="100vh"
      width="100vw"
      bg="#DCE1DE"
    >
      <Box
        p={{ base: 4, md: 8 }}
        width="full"
        maxW={{ base: "90%", md: "md" }}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={6}>
          <Text fontSize={{ base: "xl", md: "2xl" }} color="#216869">
            Login
          </Text>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="username"
              borderColor="#216869"
              _hover={{ borderColor: "#49A078" }}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                borderColor="#216869"
                _hover={{ borderColor: "#49A078" }}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            colorScheme="teal"
            variant="solid"
            width="full"
            onClick={handleSubmit}
          >
            Login
          </Button>
          <Link color="teal.500" href="/signup">
            Create New Account
          </Link>
          <Link color="teal.600" href="#">
            Forgot Your Password?
          </Link>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;
