import data from './sponsors.json'

export type TierLevel = 'platinum' | 'special' | 'gold' | 'silver' | 'bronze'

export interface Sponsor {
  name: string,
  tier: TierLevel,
  link: string,
  source: string
}

export interface Sponsors {
  platinums: Sponsor[],
  specials: Sponsor[],
  golds: Sponsor[],
  silvers: Sponsor[],
  bronzes: Sponsor[]
}

export const sponsors = data
