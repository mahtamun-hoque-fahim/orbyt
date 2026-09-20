import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema'

async function seed() {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!)
  const db = drizzle(sql, { schema })

  console.log('Seeding...')

  // Track
  const [track] = await db
    .insert(schema.tracks)
    .values({
      name: 'Full-Stack Web Development',
      slug: 'web-dev',
      description:
        'A curated path from HTML to deployment, mapped to the best YouTube channels.',
    })
    .onConflictDoNothing()
    .returning()

  if (!track) {
    console.log('Track already seeded. Exiting.')
    process.exit(0)
  }

  // Phases
  const phases = [
    {
      name: 'HTML and CSS',
      slug: 'html-css',
      channelName: 'Kevin Powell',
      channelUrl: 'https://www.youtube.com/@KevinPowell',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL4-IK0AVhVjM0xE0K2uZRvsM7LkIhsPT2',
      orderIndex: 1,
      topics: [
        'HTML document structure',
        'Semantic HTML elements',
        'Forms and inputs',
        'CSS selectors and specificity',
        'Box model',
        'Flexbox',
        'CSS Grid',
        'Responsive design and media queries',
        'CSS custom properties',
        'Positioning and z-index',
      ],
    },
    {
      name: 'Vanilla JavaScript',
      slug: 'vanilla-js',
      channelName: 'Web Dev Simplified',
      channelUrl: 'https://www.youtube.com/@WebDevSimplified',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLZlA0Gpn_vH9xx-RRVNG187ETT2ekWFsq',
      orderIndex: 2,
      topics: [
        'Variables and data types',
        'Functions and scope',
        'Arrays and array methods',
        'Objects and destructuring',
        'DOM manipulation',
        'Event listeners',
        'Fetch API and promises',
        'Async and await',
        'ES6 modules',
        'Local storage',
      ],
    },
    {
      name: 'React',
      slug: 'react',
      channelName: 'Web Dev Simplified',
      channelUrl: 'https://www.youtube.com/@WebDevSimplified',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLZlA0Gpn_vH98BNpMGJ6JODmtOL2mu8',
      orderIndex: 3,
      topics: [
        'JSX and components',
        'Props and prop types',
        'useState',
        'useEffect',
        'useRef and useCallback',
        'useMemo and performance',
        'Context API',
        'React Router',
        'Forms in React',
        'Custom hooks',
      ],
    },
    {
      name: 'TypeScript',
      slug: 'typescript',
      channelName: 'Matt Pocock',
      channelUrl: 'https://www.youtube.com/@mattpocockuk',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLIvujZeVDLMx040-j1W4WFs1BxuTGdI_b',
      orderIndex: 4,
      topics: [
        'Basic types and annotations',
        'Interfaces and type aliases',
        'Union and intersection types',
        'Generics',
        'Enums',
        'TypeScript with React',
        'Utility types',
        'Type narrowing',
        'Unknown vs any',
        'Strict mode',
      ],
    },
    {
      name: 'Next.js',
      slug: 'nextjs',
      channelName: 'Fireship',
      channelUrl: 'https://www.youtube.com/@Fireship',
      playlistUrl: 'https://www.youtube.com/results?search_query=next.js+fireship',
      orderIndex: 5,
      topics: [
        'App Router and file conventions',
        'Server and client components',
        'Data fetching patterns',
        'Server Actions',
        'Dynamic routes and params',
        'Route handlers',
        'Metadata API',
        'Image optimization',
        'Caching and revalidation',
        'Deployment to Vercel',
      ],
    },
    {
      name: 'SQL and PostgreSQL',
      slug: 'sql',
      channelName: 'Fireship',
      channelUrl: 'https://www.youtube.com/@Fireship',
      playlistUrl: 'https://www.youtube.com/results?search_query=sql+postgresql+fireship',
      orderIndex: 6,
      topics: [
        'SELECT and WHERE',
        'INSERT, UPDATE, DELETE',
        'JOIN types',
        'Aggregations and GROUP BY',
        'Indexes',
        'Primary and foreign keys',
        'Transactions',
        'Neon serverless PostgreSQL',
        'Connection pooling',
        'SQL injection prevention',
      ],
    },
    {
      name: 'Drizzle ORM',
      slug: 'drizzle',
      channelName: 'Web Dev Simplified',
      channelUrl: 'https://www.youtube.com/@WebDevSimplified',
      playlistUrl: 'https://www.youtube.com/results?search_query=drizzle+orm+web+dev+simplified',
      orderIndex: 7,
      topics: [
        'Schema definition with pgTable',
        'drizzle-kit push and generate',
        'SELECT queries',
        'INSERT and upsert',
        'UPDATE and DELETE',
        'Relations and joins in Drizzle',
        'Transactions in Drizzle',
        'Type inference from schema',
        'drizzle-kit studio',
        'Migrations in production',
      ],
    },
    {
      name: 'Deployment',
      slug: 'deployment',
      channelName: 'Fireship',
      channelUrl: 'https://www.youtube.com/@Fireship',
      playlistUrl: 'https://www.youtube.com/results?search_query=deployment+vercel+fireship',
      orderIndex: 8,
      topics: [
        'Environment variables',
        'Vercel project setup',
        'Production build checks',
        'Custom domains',
        'Preview deployments',
        'Vercel Cron Jobs',
        'Edge functions',
        'Monitoring and logs',
        'Rollbacks',
        'CI basics',
      ],
    },
  ]

  let totalTopics = 0

  for (const phase of phases) {
    const [insertedPhase] = await db
      .insert(schema.templatePhases)
      .values({
        trackId: track.id,
        name: phase.name,
        slug: phase.slug,
        channelName: phase.channelName,
        channelUrl: phase.channelUrl,
        playlistUrl: phase.playlistUrl,
        orderIndex: phase.orderIndex,
      })
      .returning()

    for (let i = 0; i < phase.topics.length; i++) {
      await db.insert(schema.templateTopics).values({
        phaseId: insertedPhase.id,
        label: phase.topics[i],
        orderIndex: i + 1,
      })
    }

    totalTopics += phase.topics.length
    console.log(`  Phase ${phase.orderIndex}: ${phase.name} (${phase.topics.length} topics)`)
  }

  console.log(`\nSeeded: 1 track, 8 phases, ${totalTopics} topics`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
