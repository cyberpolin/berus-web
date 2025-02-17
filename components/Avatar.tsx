const Avatar = ({ handleClick, image }: { handleClick?: () => void; image?: string }) => {
  return (
    <img
      onClick={handleClick}
      data-popover-target="popover-user-profile"
      className="block h-16 w-16 cursor-pointer rounded-full object-cover p-1 text-center ring-2 ring-gray-300 dark:ring-gray-500"
      src={image || '/avatar.png'}
      alt="Bordered avatar"
    />
  );
};

export default Avatar;
