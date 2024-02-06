import EditProfile from "@/components/user/editProfile";
import { AppProps } from "@/interface/data";
import React from "react";
// import UserInfo from "../../components/user/Profile";
export default function Home({ currentUser }: AppProps) {
  return (
    <main>
      <EditProfile currentUser={currentUser} />
    </main>);
}