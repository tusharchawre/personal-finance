import { SignIn ,ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'


export default function Page() {
  return (
    <div className='min-h-screen  grid grid-cols-1 lg:grid-cols-2 auto-cols-auto	'>
        <div className='h-full lg:flex flex-col justify-center items-center px-4'>
            <div className='text-center space-y-4 pt-16'>
                <h1 className='font-bold text-3xl text-[#2E2A47]'>
                    Welcome back!
                    </h1>
                <p className='text-base text-[#7e8ca0]'>Login or create an account to continue.</p>
            </div>
            <div className='flex  items-center justify-center mt-8'>
                <ClerkLoaded>
                    <SignIn path="/sign-in" />
                </ClerkLoaded>
                <ClerkLoading>
                    <Loader2 className='animate-spin text-muted-foreground' />
                </ClerkLoading>
            </div>
        </div>

            <Image src='/signinImage.jpeg'  className='h-full hidden lg:flex items-center justify-center ' alt='SignIn' width={850} height={850} />

    </div>
)
}