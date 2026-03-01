import React from 'react';

interface TopAppBarProps {
  title?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ title, searchTerm, onSearchChange }) => {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-outline-variant bg-surface/80 px-4 backdrop-blur-md transition-shadow duration-200">
      {/* Left Section: Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-on-surface">
          {title || 'Helios'}
        </h1>
      </div>

      {/* Right Section: M3 Search Bar */}
      <div className="flex flex-1 justify-end pl-8">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search PAX..."
            className="h-12 w-full rounded-full bg-surface-container-high pl-12 pr-4 text-on-surface outline-none transition-all placeholder:text-on-surface-variant focus:bg-surface-container-highest focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        {/* Optional: User Profile Placeholder */}
        <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>
      </div>
    </header>
  );
};