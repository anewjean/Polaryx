import { ClerkProvider } from '@clerk/nextjs'

export default function Page() {
  return (
    <ClerkProvider>
      <div>
        <p>여긴 워크스페이스 선택하는 곳</p>
      </div>
      

    </ClerkProvider>    
  )
}