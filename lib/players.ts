import { Player } from './types'

// Coordinates: [longitude, latitude]
// Only US locations (or locations visible on geoAlbersUsa projection)

export const ALL_PLAYERS: Player[] = [
  // ─── NBA ──────────────────────────────────────────────────
  {
    id: 'lebron',
    name: 'LeBron James',
    sport: 'NBA',
    college: { name: 'Ohio State', city: 'Columbus, OH', coords: [-83.0007, 39.9612] },
    teams: [
      { teamName: 'Cleveland Cavaliers', city: 'Cleveland, OH', coords: [-81.6881, 41.4993], years: [2003, 2010] },
      { teamName: 'Miami Heat', city: 'Miami, FL', coords: [-80.1918, 25.7617], years: [2010, 2014] },
      { teamName: 'Cleveland Cavaliers', city: 'Cleveland, OH', coords: [-81.6881, 41.4993], years: [2014, 2018] },
      { teamName: 'Los Angeles Lakers', city: 'Los Angeles, CA', coords: [-118.2437, 34.0522], years: [2018, 2025] },
    ],
  },
  {
    id: 'shaq',
    name: 'Shaquille O\'Neal',
    sport: 'NBA',
    college: { name: 'LSU', city: 'Baton Rouge, LA', coords: [-91.1403, 30.4515] },
    teams: [
      { teamName: 'Orlando Magic', city: 'Orlando, FL', coords: [-81.3790, 28.5383], years: [1992, 1996] },
      { teamName: 'Los Angeles Lakers', city: 'Los Angeles, CA', coords: [-118.2437, 34.0522], years: [1996, 2004] },
      { teamName: 'Miami Heat', city: 'Miami, FL', coords: [-80.1918, 25.7617], years: [2004, 2008] },
      { teamName: 'Phoenix Suns', city: 'Phoenix, AZ', coords: [-112.0740, 33.4484], years: [2008, 2009] },
      { teamName: 'Cleveland Cavaliers', city: 'Cleveland, OH', coords: [-81.6881, 41.4993], years: [2009, 2010] },
      { teamName: 'Boston Celtics', city: 'Boston, MA', coords: [-71.0589, 42.3601], years: [2010, 2011] },
    ],
  },
  {
    id: 'kevin-durant',
    name: 'Kevin Durant',
    sport: 'NBA',
    college: { name: 'Texas', city: 'Austin, TX', coords: [-97.7431, 30.2672] },
    teams: [
      { teamName: 'Oklahoma City Thunder', city: 'Oklahoma City, OK', coords: [-97.5164, 35.4676], years: [2007, 2016] },
      { teamName: 'Golden State Warriors', city: 'San Francisco, CA', coords: [-122.4194, 37.7749], years: [2016, 2019] },
      { teamName: 'Brooklyn Nets', city: 'Brooklyn, NY', coords: [-73.9494, 40.6501], years: [2019, 2023] },
      { teamName: 'Phoenix Suns', city: 'Phoenix, AZ', coords: [-112.0740, 33.4484], years: [2023, 2025] },
    ],
  },
  {
    id: 'vince-carter',
    name: 'Vince Carter',
    sport: 'NBA',
    college: { name: 'North Carolina', city: 'Chapel Hill, NC', coords: [-79.0558, 35.9132] },
    teams: [
      { teamName: 'New Jersey Nets', city: 'Newark, NJ', coords: [-74.1724, 40.7357], years: [2004, 2009] },
      { teamName: 'Orlando Magic', city: 'Orlando, FL', coords: [-81.3790, 28.5383], years: [2009, 2010] },
      { teamName: 'Phoenix Suns', city: 'Phoenix, AZ', coords: [-112.0740, 33.4484], years: [2010, 2011] },
      { teamName: 'Dallas Mavericks', city: 'Dallas, TX', coords: [-96.7970, 32.7767], years: [2011, 2014] },
      { teamName: 'Memphis Grizzlies', city: 'Memphis, TN', coords: [-90.0490, 35.1495], years: [2014, 2017] },
      { teamName: 'Sacramento Kings', city: 'Sacramento, CA', coords: [-121.4944, 38.5816], years: [2017, 2018] },
      { teamName: 'Atlanta Hawks', city: 'Atlanta, GA', coords: [-84.3880, 33.7490], years: [2018, 2020] },
    ],
  },
  {
    id: 'patrick-ewing',
    name: 'Patrick Ewing',
    sport: 'NBA',
    college: { name: 'Georgetown', city: 'Washington, DC', coords: [-77.0697, 38.9076] },
    teams: [
      { teamName: 'New York Knicks', city: 'New York, NY', coords: [-74.0060, 40.7128], years: [1985, 2000] },
      { teamName: 'Seattle SuperSonics', city: 'Seattle, WA', coords: [-122.3321, 47.6062], years: [2000, 2001] },
      { teamName: 'Orlando Magic', city: 'Orlando, FL', coords: [-81.3790, 28.5383], years: [2001, 2002] },
      { teamName: 'Indiana Pacers', city: 'Indianapolis, IN', coords: [-86.1581, 39.7684], years: [2002, 2002] },
    ],
  },

  // ─── NFL ──────────────────────────────────────────────────
  {
    id: 'tom-brady',
    name: 'Tom Brady',
    sport: 'NFL',
    college: { name: 'Michigan', city: 'Ann Arbor, MI', coords: [-83.7430, 42.2808] },
    teams: [
      { teamName: 'New England Patriots', city: 'Foxborough, MA', coords: [-71.2643, 42.0909], years: [2000, 2019] },
      { teamName: 'Tampa Bay Buccaneers', city: 'Tampa, FL', coords: [-82.4572, 27.9506], years: [2020, 2022] },
    ],
  },
  {
    id: 'peyton-manning',
    name: 'Peyton Manning',
    sport: 'NFL',
    college: { name: 'Tennessee', city: 'Knoxville, TN', coords: [-83.9207, 35.9606] },
    teams: [
      { teamName: 'Indianapolis Colts', city: 'Indianapolis, IN', coords: [-86.1581, 39.7684], years: [1998, 2011] },
      { teamName: 'Denver Broncos', city: 'Denver, CO', coords: [-104.9903, 39.7392], years: [2012, 2015] },
    ],
  },
  {
    id: 'brett-favre',
    name: 'Brett Favre',
    sport: 'NFL',
    college: { name: 'Southern Miss', city: 'Hattiesburg, MS', coords: [-89.2900, 31.3271] },
    teams: [
      { teamName: 'Atlanta Falcons', city: 'Atlanta, GA', coords: [-84.3880, 33.7490], years: [1991, 1991] },
      { teamName: 'Green Bay Packers', city: 'Green Bay, WI', coords: [-88.0198, 44.5192], years: [1992, 2007] },
      { teamName: 'New York Jets', city: 'East Rutherford, NJ', coords: [-74.0776, 40.8135], years: [2008, 2008] },
      { teamName: 'Minnesota Vikings', city: 'Minneapolis, MN', coords: [-93.2650, 44.9778], years: [2009, 2010] },
    ],
  },
  {
    id: 'jerry-rice',
    name: 'Jerry Rice',
    sport: 'NFL',
    college: { name: 'Mississippi Valley State', city: 'Itta Bena, MS', coords: [-90.3226, 33.5062] },
    teams: [
      { teamName: 'San Francisco 49ers', city: 'San Francisco, CA', coords: [-122.4194, 37.7749], years: [1985, 2000] },
      { teamName: 'Oakland Raiders', city: 'Oakland, CA', coords: [-122.2712, 37.8044], years: [2001, 2004] },
      { teamName: 'Seattle Seahawks', city: 'Seattle, WA', coords: [-122.3321, 47.6062], years: [2004, 2004] },
    ],
  },
  {
    id: 'emmitt-smith',
    name: 'Emmitt Smith',
    sport: 'NFL',
    college: { name: 'Florida', city: 'Gainesville, FL', coords: [-82.3250, 29.6516] },
    teams: [
      { teamName: 'Dallas Cowboys', city: 'Dallas, TX', coords: [-96.7970, 32.7767], years: [1990, 2002] },
      { teamName: 'Arizona Cardinals', city: 'Phoenix, AZ', coords: [-112.0740, 33.4484], years: [2003, 2004] },
      { teamName: 'Dallas Cowboys', city: 'Dallas, TX', coords: [-96.7970, 32.7767], years: [2004, 2004] },
    ],
  },

  // ─── MLB ──────────────────────────────────────────────────
  {
    id: 'randy-johnson',
    name: 'Randy Johnson',
    sport: 'MLB',
    college: { name: 'USC', city: 'Los Angeles, CA', coords: [-118.2851, 34.0224] },
    teams: [
      { teamName: 'Seattle Mariners', city: 'Seattle, WA', coords: [-122.3321, 47.6062], years: [1989, 1998] },
      { teamName: 'Houston Astros', city: 'Houston, TX', coords: [-95.3698, 29.7604], years: [1998, 1998] },
      { teamName: 'Arizona Diamondbacks', city: 'Phoenix, AZ', coords: [-112.0740, 33.4484], years: [1999, 2004] },
      { teamName: 'New York Yankees', city: 'Bronx, NY', coords: [-73.9262, 40.8296], years: [2005, 2006] },
      { teamName: 'Arizona Diamondbacks', city: 'Phoenix, AZ', coords: [-112.0740, 33.4484], years: [2007, 2008] },
      { teamName: 'San Francisco Giants', city: 'San Francisco, CA', coords: [-122.4194, 37.7749], years: [2009, 2009] },
    ],
  },
  {
    id: 'derek-jeter',
    name: 'Derek Jeter',
    sport: 'MLB',
    // Jeter didn't play college ball - drafted from HS in Kalamazoo, MI
    college: { name: 'Kalamazoo Central HS', city: 'Kalamazoo, MI', coords: [-85.5872, 42.2917] },
    teams: [
      { teamName: 'New York Yankees', city: 'Bronx, NY', coords: [-73.9262, 40.8296], years: [1995, 2014] },
    ],
  },
  {
    id: 'albert-pujols',
    name: 'Albert Pujols',
    sport: 'MLB',
    teams: [
      { teamName: 'St. Louis Cardinals', city: 'St. Louis, MO', coords: [-90.1994, 38.6270], years: [2001, 2011] },
      { teamName: 'Los Angeles Angels', city: 'Anaheim, CA', coords: [-117.8265, 33.8003], years: [2012, 2021] },
      { teamName: 'Los Angeles Dodgers', city: 'Los Angeles, CA', coords: [-118.2437, 34.0522], years: [2021, 2021] },
      { teamName: 'St. Louis Cardinals', city: 'St. Louis, MO', coords: [-90.1994, 38.6270], years: [2022, 2022] },
    ],
  },

  // ─── NHL ──────────────────────────────────────────────────
  {
    id: 'wayne-gretzky',
    name: 'Wayne Gretzky',
    sport: 'NHL',
    // Gretzky is Canadian so no US college; first US team is LA Kings
    teams: [
      { teamName: 'Los Angeles Kings', city: 'Los Angeles, CA', coords: [-118.2437, 34.0522], years: [1988, 1996] },
      { teamName: 'St. Louis Blues', city: 'St. Louis, MO', coords: [-90.1994, 38.6270], years: [1996, 1996] },
      { teamName: 'New York Rangers', city: 'New York, NY', coords: [-74.0060, 40.7128], years: [1996, 1999] },
    ],
  },
  {
    id: 'mario-lemieux',
    name: 'Mario Lemieux',
    sport: 'NHL',
    teams: [
      { teamName: 'Pittsburgh Penguins', city: 'Pittsburgh, PA', coords: [-79.9959, 40.4406], years: [1984, 2006] },
    ],
  },
]

export function getPlayerById(id: string): Player | undefined {
  return ALL_PLAYERS.find(p => p.id === id)
}

export function getPlayerByName(name: string): Player | undefined {
  const normalized = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')
  return ALL_PLAYERS.find(p => normalized(p.name) === normalized(name))
}

export function searchPlayers(query: string): Player[] {
  if (query.length < 2) return []
  const q = query.toLowerCase()
  return ALL_PLAYERS.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8)
}

/** All stops for a player including college, in order */
export function getPlayerStops(player: Player): Array<{ teamName: string; city: string; coords: [number, number]; years: [number, number]; isCollege?: boolean }> {
  const stops = []
  if (player.college) {
    stops.push({
      teamName: player.college.name,
      city: player.college.city,
      coords: player.college.coords,
      years: [0, 0] as [number, number],
      isCollege: true,
    })
  }
  stops.push(...player.teams)
  return stops
}
