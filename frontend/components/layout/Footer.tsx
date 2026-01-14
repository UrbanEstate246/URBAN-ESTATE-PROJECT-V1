import Link from 'next/link' 
import Image from 'next/image' 
import Container from './Container' 

export default function Footer() { 
  const currentYear = new Date().getFullYear() 

  return ( 
    <footer className="bg-civic-blue text-white mt-auto"> 
      <Container> 
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8"> 
          {/* Logo & Description */} 
          <div className="col-span-1 md:col-span-2"> 
            <Image 
              src="/logo/logo-horizontal.png" 
              alt="UrbanEstate" 
              width={180} 
              height={40} 
              className="h-10 w-auto mb-4 brightness-0 invert" 
            /> 
            <p className="text-white/80 text-sm max-w-md"> 
              Verified real estate platform for Kenya. Find your next home with confidence. 
            </p> 
          </div> 

          {/* Quick Links */} 
          <div> 
            <h3 className="font-semibold mb-4">Quick Links</h3> 
            <ul className="space-y-2 text-sm"> 
              <li> 
                <Link href="/properties" className="text-white/80 hover:text-white transition-colors"> 
                  Browse Properties 
                </Link> 
              </li> 
              <li> 
                <Link href="/list-property" className="text-white/80 hover:text-white transition-colors"> 
                  List Property 
                </Link> 
              </li> 
              <li> 
                <Link href="/how-it-works" className="text-white/80 hover:text-white transition-colors"> 
                  How It Works 
                </Link> 
              </li> 
              <li> 
                <Link href="/about" className="text-white/80 hover:text-white transition-colors"> 
                  About Us 
                </Link> 
              </li> 
            </ul> 
          </div> 

          {/* Contact */} 
          <div> 
            <h3 className="font-semibold mb-4">Contact</h3> 
            <ul className="space-y-2 text-sm text-white/80"> 
              <li>Nairobi, Kenya</li> 
              <li> 
                <Link href="/contact" className="hover:text-white transition-colors"> 
                  Contact Us 
                </Link> 
              </li> 
            </ul> 
          </div> 
        </div> 

        {/* Bottom Bar */} 
        <div className="border-t border-white/10 py-6 text-center text-white/60 text-sm"> 
          <p>© {currentYear} UrbanEstate. All rights reserved.</p> 
        </div> 
      </Container> 
    </footer> 
  ) 
} 

