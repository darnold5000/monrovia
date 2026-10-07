const logo = "/images/monrovia/logo.jpg";

/** Monrovia MOBS media — legacy Sluggers asset keys stubbed to league logo for unused routes. */
export const media = {
  brand: {
    logo,
    favicon: logo,
    og: logo,
  },
  hero: logo,
  facility: {
    main: logo,
    mainTurfWide: logo,
    upstairs: logo,
    upstairsTraining: logo,
    hitting: logo,
    softball: logo,
    racks: logo,
    racksRow: logo,
    kettlebell: logo,
    discipline: logo,
  },
  training: {
    baseballHitting: logo,
    baseballPitching: logo,
    softballHitting: logo,
    softballPitching: logo,
  },
  coaches: {
    billAmero: logo,
    tonySarigianopolous: logo,
    victoria: logo,
  },
  tournaments: {
    fallBrawl: logo,
    hydrocephalusFundraiser: logo,
    softballTournamentSeries2027: logo,
  },
  tournament: logo,
} as const;
