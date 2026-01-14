import Link from 'next/link' 
import Image from 'next/image' 
import Container from './Container' 

export default function Header() { 
  return ( 
    <header className="bg-white border-b border-subtle-border sticky top-0 z-50"> 
      <Container> 
        <nav className="flex items-center justify-between py-4"> 
          {/* Logo */} 
          <Link href="/" className="flex items-center"> 
            <Image 
              src="/logo/logo-horizontal.png" 
              alt="UrbanEstate" 
              width={180} 
              height={40} 
              priority 
              className="h-10 w-auto" 
            /> 
          </Link> 

          {/* Navigation Links */} 
          <div className="hidden md:flex items-center gap-8"> 
            <Link 
              href="/properties" 
              className="text-deep-charcoal hover:text-civic-blue transition-colors font-medium" 
            > 
              Find Property 
            </Link> 
            <Link 
              href="/list-property" 
              className="text-deep-charcoal hover:text-civic-blue transition-colors font-medium" 
            > 
              List Property 
            </Link> 
          </div> 

          {/* Auth Buttons */} 
          <div className="flex items-center gap-4"> 
            <Link 
              href="/login" 
              className="text-deep-charcoal hover:text-civic-blue transition-colors font-medium" 
            > 
              Sign In 
            </Link> 
            <Link 
              href="/register" 
              className="bg-civic-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors" 
            > 
              Get Started 
            </Link> 
          </div> 
        </nav> 
      </Container> 
    </header> 
  ) 
} 

