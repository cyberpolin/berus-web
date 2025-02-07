const Avatar = ({  handleClick, image }: { handleClick?: () => void , image?:string }) => {
  return (
    <img
      onClick={handleClick}
      data-popover-target="popover-user-profile"
      className="block rounded-full p-1 text-center ring-2 ring-gray-300 dark:ring-gray-500 cursor-pointer object-cover w-16 h-16"
      src={image || "/avatar.png"}
      alt="Bordered avatar"
    />
  )
};

export default Avatar;

