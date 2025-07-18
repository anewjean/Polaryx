import React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartNoAxesColumn } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 더미 데이터
const chartData = [
  { user_id: "aaaaa", nickname: "이재웅", profileImage: "https://media.themoviedb.org/t/p/w235_and_h235_face/kZUO2s2ZsBRYZ8acu0wMzlGHpRS.jpg", message: 186, reaction: 80, date: "2025-07-01" },
  { user_id: "baaaa", nickname: "안유진", profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJTo8iIFzFIFddj2NH-6RVX7icC3qstTXnOw&s", message: 305, reaction: 200, date: "2025-06-15" },
  { user_id: "bbaaa", nickname: "신명훈", profileImage: "https://watching-img.pickle.plus/person/105ba016-a5bc-46f0-878a-53cbe797ba50-1737601216444.jpg?w=256&q=75&format=webp", message: 237, reaction: 120, date: "2025-05-20" },
  { user_id: "bbbaa", nickname: "박은채", profileImage: "https://i.namu.wiki/i/WoqVHNro3L3azYGRDgGSUs0Urkf4zxa4bCAC2bZ6NzyPY0Z-Z6s1HJGt0MC13A2FPMQlmNoZIgGICdF9EdKGcA.webp", message: 73, reaction: 190, date: "2025-07-10" },
  { user_id: "bbbba", nickname: "이찬석", profileImage: "https://i.playboard.app/p/AATXAJyeQzU8gwA0mHWkUhikyG3raEHC2gKomgGF01j9/default.jpg", message: 209, reaction: 130, date: "2024-10-05" },
  { user_id: "caaaa", nickname: "김민정", profileImage: "", message: 250, reaction: 150, date: "2025-06-25" },
  { user_id: "ccaaa", nickname: "정해인", profileImage: "", message: 150, reaction: 210, date: "2024-08-15" },
  { user_id: "cccaa", nickname: "박보검", profileImage: "", message: 190, reaction: 90, date: "2025-07-05" },
  { user_id: "cccca", nickname: "송강", profileImage: "", message: 290, reaction: 180, date: "2024-09-20" },
  { user_id: "daaaa", nickname: "고윤정", profileImage: "", message: 310, reaction: 250, date: "2025-07-12" },
];

// 차트 색상 설정
const chartConfig = {
  message: {
    label: "Message",
    color: "hsl(var(--chart-1))",
  },
};

// 프로필 이미지가 표시될 위치 지정
const CustomYAxisTick = ({ x, y, payload }: any) => {
  const data = chartData.find((d) => d.nickname === payload.value);
  const imageUrl = data?.profileImage || '/user_default.png';

  return (
    <g transform={`translate(${x - 40}, ${y - 20})`}>
      {imageUrl === '/user_default.png' && (
        <rect x={0} y={0} height="36px" width="36px" fill="#9ca3af" clipPath="inset(0% round 6px)" />
      )}
      <image href={imageUrl} x={0} y={0} height="36px" width="36px" clipPath="inset(0% round 6px)" />
    </g>
  );
};

export function MostActiveByMessage() {
  
  // 기간 필터 상태 관리
  const [timeRange, setTimeRange] = React.useState("12m");

  // 데이터 계산 (실제로는 API에서 데이터를 가져와야 할 수도 있음)
  const filteredData = React.useMemo(() => {
    const now = new Date();
    let monthsToSubtract = 12;
    if (timeRange === "6m") {
      monthsToSubtract = 6;
    } else if (timeRange === "3m") {
      monthsToSubtract = 3;
    }
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - monthsToSubtract);

    return chartData
      .filter((item) => new Date(item.date) >= startDate)
      .sort((a, b) => b.message - a.message)
      .slice(0, 10);
  }, [timeRange]);

  // 차트 높이, 바 높이, 간격 계산
  const barHeight = 40;
  const gap = 15;
  const chartHeight = 10 * (barHeight + gap);

  return (
    <Card>
      {/* 차트 제목 */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-lg">Most Active by Message</CardTitle>
          <CardDescription>Top 10 learners by message count</CardDescription>
        </div>
        {/* 기간 필터 */}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px] rounded-lg ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="12m" className="rounded-lg">Last 12 months</SelectItem>
            <SelectItem value="6m" className="rounded-lg">Last 6 months</SelectItem>
            <SelectItem value="3m" className="rounded-lg">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      {/* 차트 내용 */}
      <CardContent className="px-2 pt-0">
        <ChartContainer config={chartConfig} className="w-full" style={{ height: `${chartHeight}px` }}>          
          <BarChart accessibilityLayer data={filteredData} layout="vertical" margin={{ left: 0, right: 40 }} barCategoryGap="35%">
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="nickname" type="category" tickLine={false} axisLine={false} tick={<CustomYAxisTick />} />
            <XAxis dataKey="message" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="message" layout="vertical" fill="var(--color-message)" radius={4} barSize={barHeight}>
              <LabelList dataKey="nickname" position="insideLeft" offset={8} className="fill-background" fontSize={13} />
              <LabelList dataKey="message" position="right" offset={8} className="fill-foreground" fontSize={13} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* 차트 설명 */}
      <CardFooter className="flex-col pl-0 ml-3 items-start gap-2 text-sm">
        <div className="flex gap-1 text-muted-foreground leading-none">
          <ChartNoAxesColumn className="h-4 w-4" />
          Showing top 10 learners by message count
        </div>
      </CardFooter>
    </Card>
  );
}
