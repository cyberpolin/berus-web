import Link from 'next/link';

type SubmenuItem = { title: string; url: string };

type Items = { items: [SubmenuItem]; hidden: boolean };

const SubMenu = ({ items, hidden }: Items) => {
  return (
    <div
      id="mega-menu-full-cta-dropdown"
      className={`absolute ${
        hidden ? 'hidden' : ''
      } top-full mt-1 border-y border-gray-200 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800`}
    >
      <div className="mx-auto grid max-w-screen-xl px-4 py-5 text-sm text-gray-500 md:grid-cols-3 md:px-6 dark:text-gray-400">
        <ul
          className="space-y-4 sm:mb-4 md:mb-0"
          aria-labelledby="mega-menu-full-cta-button"
        >
          {items.map(({ title, url }: SubmenuItem, i: number) => {
            return (
              <li key={i}>
                <Link
                  href={url}
                  className="hover:text-blue-600 hover:underline dark:hover:text-blue-500"
                >
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SubMenu;
