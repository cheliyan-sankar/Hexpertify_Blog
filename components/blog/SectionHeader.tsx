interface SectionHeaderProps {
  title: string;
  className?: string;
}

export default function SectionHeader({ title, className = '' }: SectionHeaderProps) {
  return (
    <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${className}`}>
      {title}
    </h2>
  );
}
