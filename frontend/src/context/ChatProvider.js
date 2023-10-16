import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();

  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
      if (!userInfo) {
        history.push("/");
      }
    };
    fetchUserData();
  }, [history]);

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
