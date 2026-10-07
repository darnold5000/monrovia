import { redirect } from "next/navigation";
import { monroviaExternal } from "@/lib/monrovia-urls";

/** Member / family login — Stack Sports on monroviaball.com */
export default function LoginRedirectPage() {
  redirect(monroviaExternal.login);
}
