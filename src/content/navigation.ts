export const navigation = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/teams", label: "Teams" },
  { href: "/tryouts", label: "Tryouts" },
  { href: "/schedule", label: "Schedule" },
  { href: "/sponsors", label: "Sponsors" },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about", label: "About MOBS" },
      { href: "/about/board", label: "Board" },
      { href: "/contact", label: "Contact" },
      { href: "/volunteer", label: "Volunteer" },
    ],
  },
] as const;

export const cta = {
  register: { label: "Register", href: "/register" },
  login: { label: "Login", href: "/login" },
  primary: { label: "Register", href: "/register" },
  phone: { label: "Contact", href: "/contact" },
} as const;
