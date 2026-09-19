import React from "react";
import connect from "@/lib/db";
import DbUnavailable from "./db-unabailable";

const DbGate = async ({ children }: { children: React.ReactNode }) => {
    try {
      await connect();
    } catch (err: any) {
      console.error(err.message);
      return <DbUnavailable />;
    }
    return <>{children}</>;
}

export default DbGate;