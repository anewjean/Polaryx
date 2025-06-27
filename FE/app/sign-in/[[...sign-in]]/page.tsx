import { ClerkProvider, SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <ClerkProvider>
        <div
            className="flex justify-center items-center"
            style={{padding:50}}
            >
            <SignIn />
        </div>
    </ClerkProvider>
  )
}