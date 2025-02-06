const Avatar = ({ width, handleClick }: { width?: string, handleClick?: () => void }) => {
  const size = width ?? '80';
  return (
    <img
      onClick={handleClick}
      data-popover-target="popover-user-profile"
      className="block rounded-full p-1 text-center ring-2 ring-gray-300 dark:ring-gray-500 cursor-pointer"
      src="/avatar.png"
      alt="Bordered avatar"
      width={size}
    />
  )
};

export default Avatar;

