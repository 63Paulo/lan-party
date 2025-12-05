import prisma from '../src/config/prisma.js'
import bcrypt from 'bcrypt'

const games = [
  {
    name: 'Counter-Strike 2',
    genre: 'FPS',
    releaseYear: 2023,
    minPlayers: 2,
    maxPlayers: 10,
    description: 'Tactical FPS reference game',
  },
  {
    name: 'League of Legends',
    genre: 'MOBA',
    releaseYear: 2009,
    minPlayers: 2,
    maxPlayers: 10,
    description: 'Competitive team-based MOBA',
  },
  {
    name: 'Valorant',
    genre: 'FPS',
    releaseYear: 2020,
    minPlayers: 2,
    maxPlayers: 10,
    description: 'Tactical FPS with agents',
  },
  {
    name: 'Apex Legends',
    genre: 'FPS',
    releaseYear: 2019,
    minPlayers: 3,
    maxPlayers: 60,
    description: 'Battle royale with hero abilities',
  },
]

const stations = [
  {
    name: 'Gaming Station Alpha',
    cpu: 'Intel Core i9-14900KS',
    gpu: 'NVIDIA RTX 4090 Ti',
    ram: '64GB DDR5',
    storage: '4TB NVMe SSD',
    monitor: 'ASUS ROG Swift 32" 360Hz',
    keyboard: 'Corsair K100',
    mouse: 'Logitech G Pro X2',
    headset: 'SteelSeries Arctis Nova Pro',
    status: 'available',
  },
  {
    name: 'Gaming Station Beta',
    cpu: 'AMD Ryzen 9 7950X',
    gpu: 'NVIDIA RTX 4080',
    ram: '32GB DDR5',
    storage: '1TB NVMe SSD',
    monitor: 'LG UltraGear 27" 165Hz',
    keyboard: 'Razer BlackWidow V3',
    mouse: 'Razer DeathAdder V3',
    headset: 'HyperX Cloud Alpha',
    status: 'available',
  },
  {
    name: 'Gaming Station Gamma',
    cpu: 'Intel Core i7-13700K',
    gpu: 'NVIDIA RTX 4070 Ti',
    ram: '16GB DDR5',
    storage: '1TB NVMe SSD',
    monitor: 'BenQ Zowie 24" 144Hz',
    keyboard: 'Logitech G915 TKL',
    mouse: 'Glorious Model O',
    headset: 'Corsair HS80 RGB',
    status: 'booked',
  },
  {
    name: 'Gaming Station Delta',
    cpu: 'AMD Ryzen 7 7800X3D',
    gpu: 'AMD Radeon RX 7900 XT',
    ram: '32GB DDR5',
    storage: '2TB NVMe SSD',
    monitor: 'Samsung Odyssey G7 32" 240Hz',
    keyboard: 'SteelSeries Apex Pro',
    mouse: 'Finalmouse Ultralight 2',
    headset: 'Astro A50 Wireless',
    status: 'maintenance',
  },
  {
    name: 'Gaming Station Epsilon',
    cpu: 'Intel Core i5-13600K',
    gpu: 'NVIDIA RTX 4060 Ti',
    ram: '16GB DDR4',
    storage: '512GB NVMe SSD',
    monitor: 'AOC 24G2 24" 144Hz',
    keyboard: 'HyperX Alloy Origins',
    mouse: 'SteelSeries Rival 3',
    headset: 'Logitech G Pro X',
    status: 'available',
  },
]

async function main() {
  console.log('Seeding database...')

  // Hash password for users
  const hashedPassword = await bcrypt.hash('P@ssw0rd', 10)

  const users = [
    {
      username: 'admin',
      email: 'admin@lanparty.com',
      password: hashedPassword,
      role: 'admin',
    },
    {
      username: 'gamer1',
      email: 'gamer1@lanparty.com',
      password: hashedPassword,
      role: 'user',
    },
    {
      username: 'progamer',
      email: 'progamer@lanparty.com',
      password: hashedPassword,
      role: 'user',
    },
    {
      username: 'casualplayer',
      email: 'casual@lanparty.com',
      password: hashedPassword,
      role: 'user',
    },
  ]

  // Clear existing data
  await prisma.game.deleteMany()
  await prisma.station.deleteMany()
  await prisma.user.deleteMany()

  // Insert games (batch insert)
  await prisma.game.createMany({ data: games })
  console.log(`Created ${games.length} games`)

  // Insert stations (batch insert)
  await prisma.station.createMany({ data: stations })
  console.log(`Created ${stations.length} stations`)

  // Insert users (batch insert)
  await prisma.user.createMany({ data: users })
  console.log(`Created ${users.length} users (password: P@ssw0rd)`)

  console.log('Seeding completed!')
}

main()
  .catch(e => {
    console.error(e)
    throw new Error('Seeding failed')
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
