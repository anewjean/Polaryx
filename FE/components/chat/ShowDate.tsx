export function ShowDate(props: { timestamp: number }) {
  return (
    <div className="relative">
      <hr className="absolute inset-x-0 top-1/2 border-t divider-gray" />
      <div className="relative z-10 mx-auto w-[120px] h-[28px] border-divider-gray flex items-center justify-center rounded-full">
        <span className="text-center text-s-bold">
          {new Date(props.timestamp).toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </span>
      </div>
    </div>
  );
}
