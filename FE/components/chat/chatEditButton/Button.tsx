export function EditButton(props: { text: string; subtext: string }) {
  return (
    <button className="flex flex-1 flex-row justify-between hover:bg-blue-500 gap-2 p-4 text-sm overflow-hidden text-gray-900">
      <span>{props.text}</span>
      <span>{props.subtext}</span>
    </button>
  );
}
