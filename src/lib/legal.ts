import { site } from "@/content/site";

export function privacyPolicySections() {
  return [
    {
      title: "Overview",
      paragraphs: [
        `${site.name} ("we," "us") operates this website to provide league information and links to our registration provider. This policy describes how we handle information collected through the site.`,
        "This policy is provided for initial launch and should be reviewed by the business owner and legal counsel before production use.",
      ],
    },
    {
      title: "Information we collect",
      paragraphs: [
        "When you submit a contact form, we collect the information you provide, such as your name, email, phone number, and message.",
        "We may collect basic analytics and attribution data, such as pages visited, referral source, and UTM campaign parameters, to understand how visitors find our site.",
        "We do not intentionally collect sensitive health information through this website.",
      ],
    },
    {
      title: "How we use information",
      paragraphs: [
        "We use inquiry information to respond to your request about league programs and activities.",
        "We use analytics data in aggregate to improve the website and understand marketing performance.",
        "We do not sell your personal information.",
      ],
    },
    {
      title: "Third-party services",
      paragraphs: [
        "This site may use email delivery providers, hosting, analytics, and embedded maps or social links. Those services process data according to their own policies.",
        "Links to Instagram or other third-party sites are governed by those platforms' policies.",
      ],
    },
    {
      title: "Contact",
      paragraphs: [
        `Questions about this policy: ${site.email}${site.phone ? ` or ${site.phone}` : ""}.`,
      ],
    },
  ];
}

export function termsSections() {
  return [
    {
      title: "Website terms",
      paragraphs: [
        `By using the ${site.name} website, you agree to these terms. If you do not agree, please do not use the site.`,
        "These website terms are not a substitute for any separate league waiver, code of conduct, or registration agreements required through the official registration provider.",
      ],
    },
    {
      title: "No medical advice",
      paragraphs: [
        "Information on this website is general in nature and is not medical advice. Consult a qualified healthcare provider before beginning any exercise program.",
        "Participation in league activities may require separate waivers and policies provided through the registration provider or league administrators.",
      ],
    },
    {
      title: "Program information",
      paragraphs: [
        "Descriptions of programs, teams, and events are general. Schedules and registration availability may change. Confirm details on the official registration portal or with league administrators.",
        "We do not guarantee specific playing time, team placement, or competitive outcomes.",
      ],
    },
    {
      title: "Contact form",
      paragraphs: [
        "By submitting an inquiry, you agree that we may contact you about your request. Message and data rates may apply for text or phone contact initiated in response to your inquiry.",
        "Do not submit sensitive personal or health information through this form.",
      ],
    },
    {
      title: "Limitation of liability",
      paragraphs: [
        "This website is provided on an 'as is' basis. To the fullest extent permitted by law, we disclaim liability arising from use of the site or reliance on its content.",
      ],
    },
    {
      title: "Contact",
      paragraphs: [
        `Questions: ${site.email}${site.phone ? ` · ${site.phone}` : ""} · ${site.address.full}`,
      ],
    },
  ];
}
