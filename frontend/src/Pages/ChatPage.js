import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import MyChats from "../Components/miscellaneous/MyChats";
import ChatBox from "../Components/miscellaneous/ChatBox";
import { useState } from "react";

const ChatPage = () => {
  const { user } = ChatState(); //take user state from context api
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {/* //if user present, show SideDrawer */}
      {user && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
