import { redirect } from "next/navigation";

export default function TeamRentalsRedirectPage() {
  redirect("/availability?calendar=field&service=playing-field-rental");
}
