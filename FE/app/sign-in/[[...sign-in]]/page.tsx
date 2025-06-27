import { ClerkProvider, SignIn } from '@clerk/nextjs'
import { light } from "@clerk/themes"

export default function Page() {
  return (
    <ClerkProvider>
        <div
            className="flex justify-center items-center"
            style={{padding:50}}
            >
            <SignIn appearance={{baseTheme: light}}/>
        </div>
    </ClerkProvider>
  )
}