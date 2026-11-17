import type { Metadata } from 'next'
import { SnaplogicArchitecture } from '@/components/case-studies/snaplogic/snaplogic-architecture'

export const metadata: Metadata = {
 title: 'Enterprise Integration Architecture — Sai Pamula',
 description: 'An interactive personal SnapLogic reference architecture exploring enterprise connectivity, orchestration, data transformation and reliability engineering.',
 openGraph: { title: 'Enterprise Integration Architecture — Sai Pamula', description: 'Explore a personal SnapLogic reference architecture through interactive diagrams, pipeline scenarios and technical notes.', type: 'article' },
}

export default function SnapLogicArchitecturePage() { return <SnaplogicArchitecture /> }
