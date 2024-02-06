import User from "@/components/user/user";
import UserInfo from "../../components/user/userInfo";
import { AppProps } from "@/interface/data";
export default function Home({ onlineUsersss, currentUser, users, amis }: AppProps) {

  // const re = `/users/[${name}]`

  return (
    <main>
      <User />
    </main>);
}
