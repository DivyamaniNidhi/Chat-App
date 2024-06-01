import {
  Container,
  Box,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React from "react";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    //if user logged in redirect it to chat page
    if (user) {
      history.push("/chats");
    }
  }, [history]); //if the history changes, it gonna run again

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={1}
        bg={"white"}
        w="100%"
        m="15px 0 7px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          CHIT-CHAT
        </Text>
      </Box>
      <Box
        p={3}
        bg={"white"}
        color="black"
        w="100%"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
