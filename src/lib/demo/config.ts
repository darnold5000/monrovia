/** Clearly fake demo address — never use a real Gmail that testers might sign up with. */
export const DEMO_CLIENT_EMAIL = "demo-client@hiresignalworks.com";
export const DEMO_OWNER_EMAIL = "ton@ton.com";
export const DEMO_PASSWORD = "password";

export function isDemoLoginEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN === "true";
}

export function isDemoCheckoutBypassEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_CHECKOUT === "true";
}

export const demoAccounts = {
  client: {
    id: "client" as const,
    label: "Demo Client",
    email: DEMO_CLIENT_EMAIL,
    password: DEMO_PASSWORD,
  },
  owner: {
    id: "owner" as const,
    label: "Demo Owner",
    email: DEMO_OWNER_EMAIL,
    password: DEMO_PASSWORD,
  },
};

export type DemoAccountId = keyof typeof demoAccounts;
