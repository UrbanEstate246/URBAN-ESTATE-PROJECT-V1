import Link from 'next/link' 
import Container from '@/components/layout/Container' 

export default function HomePage() { 
  return ( 
    <div className="py-20"> 
      <Container> 
        <div className="max-w-4xl mx-auto text-center"> 
          {/* Hero Section */} 
          <h1 className="text-4xl md:text-5xl font-semibold text-deep-charcoal mb-6"> 
            Verified properties. Clear pricing. No surprises. 
          </h1> 
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"> 
            Find your next home in Kenya with confidence. Browse verified listings from trusted landlords. 
          </p> 

          {/* CTA Buttons */} 
          <div className="flex flex-col sm:flex-row gap-4 justify-center"> 
            <Link 
              href="/properties" 
              className="bg-civic-blue text-white px-8 py-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors" 
            > 
              Browse Properties 
            </Link> 
            <Link 
              href="/list-property" 
              className="bg-white text-civic-blue border-2 border-civic-blue px-8 py-4 rounded-lg font-medium hover:bg-civic-blue hover:text-white transition-colors" 
            > 
              List Your Property 
            </Link> 
          </div> 
        </div> 
      </Container> 
    </div> 
  ) 
} 

