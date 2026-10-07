import { redirect } from "next/navigation";
import { monroviaExternal } from "@/lib/monrovia-urls";

export default function RegisterRedirectPage() {
  redirect(monroviaExternal.register);
}
