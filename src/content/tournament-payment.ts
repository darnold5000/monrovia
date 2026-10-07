export const tournamentPayment = {
  venmoHandle: "@billamero",
  venmoUrl: "https://venmo.com/u/billamero",
  venmoImage: "/images/sluggers/payments/venmo-bill-amero.jpg",
} as const;

type TournamentPaymentOverrides = {
  depositAmount?: string;
  phone?: string;
};

function formatDepositAmount(value: string, fallback: string) {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
}

function phoneHref(value: string) {
  const digits = value.replace(/\D/g, "");
  return `tel:${digits}`;
}

export function tournamentPaymentDetails(variant: "standard" | "series", overrides: TournamentPaymentOverrides = {}) {
  const base = variant === "series"
    ? {
        depositAmount: "$150",
        phoneDisplay: "330-549-6150",
        phoneContext: "with questions.",
      }
    : {
        depositAmount: "$100",
        phoneDisplay: "330-501-7506",
        phoneContext: "for payment options.",
      };
  const depositAmount = formatDepositAmount(overrides.depositAmount ?? "", base.depositAmount);
  const phoneDisplay = overrides.phone?.trim() || base.phoneDisplay;

  return {
    ...base,
    depositAmount,
    depositInstructions: `A ${depositAmount} deposit, per tournament entered, or full payment is required to guarantee a spot in the tournament. If providing a deposit, the remaining balance is to be paid, in full, 30 days prior to each tournament entered. No refunds are issued within 30 days of the tournament entered.`,
    phoneDisplay,
    phoneHref: phoneHref(phoneDisplay),
  };
}
