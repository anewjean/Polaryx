interface EditInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EditInput({ value, onChange, onSave, onCancel }: EditInputProps) {
  return (
    <>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="border px-1" />
      <button onClick={onSave} className="ml-2 text-blue-500">
        Save
      </button>
      <button onClick={onCancel} className="ml-1 text-gray-500">
        Cancel
      </button>
    </>
  );
}
