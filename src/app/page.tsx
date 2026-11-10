import { redirect } from "next/navigation";
import { USER_HOME } from "@/constants";

export default function HomePage() {
  redirect(USER_HOME);
}
