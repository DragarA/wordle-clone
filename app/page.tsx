import Image from 'next/image'
import WordleContainer from './components/WordleContainer'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen p-4">
        <WordleContainer></WordleContainer>
    </main>
  )
}
