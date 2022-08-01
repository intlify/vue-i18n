import { ref, onMounted } from 'vue'

interface Sponsors {
  special: Sponsor[]
  platinum: Sponsor[]
  gold: Sponsor[]
  silver: Sponsor[]
  bronze: Sponsor[]
}

interface Sponsor {
  name: string
  img: string
  url: string
}

// shared data across instances so we load only once.
const data = ref()

async function fetchSponsors() {
  return await import('../sponsors.json').then(m => m || (m as any).default)
}

export function useSponsor() {
  onMounted(async () => {
    if (data.value) {
      return
    }

    const json = await fetchSponsors()
    data.value = mapSponsors(json)
  })

  return {
    data
  }
}

function mapSponsors(sponsors: Sponsors) {
  return [
    {
      tier: 'Platinum Sponsors',
      size: 'big',
      items: mapImgPath(sponsors['platinum'])
    },
    {
      tier: 'Special Sponsors',
      size: 'big',
      items: mapImgPath(sponsors['special'])
    },
    {
      tier: 'Gold Sponsors',
      size: 'medium',
      items: mapImgPath(sponsors['gold'])
    },
    {
      tier: 'Bronze Sponsors',
      size: 'small',
      items: mapImgPath(sponsors['bronze'])
    }
  ]
}

function mapImgPath(sponsors: Sponsor[]) {
  return sponsors.map((sponsor) => ({
    ...sponsor,
    img: `/${sponsor.img}`
  }))
}