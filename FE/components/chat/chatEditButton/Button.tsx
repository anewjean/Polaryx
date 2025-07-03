export function EditButton(props: { text: string; subtext: string }) {
  return (
    <button className="w-[270px] h-[28px] text-sm text-gray-900 hover:bg-[#1264a3] hover:text-white leading-none block text-left">
      <span>{props.text}</span>
      <span className="absolute right-8">{props.subtext}</span>
    </button>
  );
}
