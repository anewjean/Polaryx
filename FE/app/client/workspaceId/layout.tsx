"use client"

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

export default function workspaceLayout({ children }: { children: React.ReactNode }) {   
    return (
        <div className="flex flex-row h-screen">
            <ResizablePanelGroup direction="horizontal" className="h-full w-full">                
                <ResizablePanel defaultSize={20} minSize={10} maxSize={40}>
                    {/* 사이드바 영역*/}
                    <div className="h-full w-full bg-red-500"></div>                
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={80} minSize={20} maxSize={90}> 
                    {/* 채널 영역*/}
                    <div className="h-full w-full bg-green-500"></div>               
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={20} minSize={10} maxSize={40}> 
                    {/* 프로필/스레드 영역*/}
                    <div className="h-full w-full bg-blue-500"></div>                
                </ResizablePanel>
                <ResizableHandle />         
            </ResizablePanelGroup>
        </div>    
    )
}
