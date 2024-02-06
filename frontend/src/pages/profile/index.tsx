import UseProfile from "@/components/user/profile";
import { AppProps, userProps } from "@/interface/data";
// import UserInfo from "../../components/user/Profile";
export default function Home({ currentUser }: AppProps) {
  return (
    <div className=" w-full  min-h-screen bg-bldue-900 " >
      <UseProfile />
    </div>);
}