"use client";

import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const UserContext = React.createContext();

function UserProvider(props) {
  const [session, setSession] = useState();
  useEffect(() => {
    async function decodeJWT(token) {
      try {
        if (token) {
          const decoded = jwt.decode(token);
          return setSession(decoded);
        } else {
          return setSession("unlogged");
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return setSession("unlogged");
      }
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("AccessToken");
      decodeJWT(token);
    }
  }, [typeof window !== "undefined" && localStorage.getItem("AccessToken")]);

  return (
    <UserContext.Provider
      value={{
        session,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
