import ListBlocked from "@/components/user/listBlocked";
import { AppProps } from "@/interface/data";
import React from "react";
// import UserInfo from "../../components/user/Profile";
export default function Home({ currentUser }: AppProps) {
  return (
    <main>
      <ListBlocked currentUser={currentUser} />
    </main>);
}