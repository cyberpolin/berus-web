import Link from 'next/link';
const LMenu = ({ href, title }: { href: string; title: string }) => {
  return (
    <Link
      className="block p-5 text-center text-sm hover:text-gray-800 hover:underline md:mt-0 md:inline-block dark:text-amber-50"
      href={href}
      key={href}
    >
      {title}
    </Link>
  );
};

export default LMenu;
