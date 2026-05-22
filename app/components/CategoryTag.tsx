import Link from "next/link";

interface CategoryTagProps {
  label: string;
  slug: string;
}

export default function CategoryTag({ label, slug }: CategoryTagProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className="inline-block text-xs font-medium uppercase tracking-wider text-[#326891] hover:underline"
    >
      {label}
    </Link>
  );
}
