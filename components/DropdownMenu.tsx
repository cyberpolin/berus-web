import { useState } from 'react';

const DropdownMenu = ({ Avatar, children }: { Avatar: React.ReactNode, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div onClick={toggleMenu}>
        { Avatar}
      </div>

      {isOpen && (
        <div className="z-50 origin-top-right absolute right-0 m-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

