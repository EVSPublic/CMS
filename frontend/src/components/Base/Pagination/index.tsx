import { twMerge } from "tailwind-merge";
import Button from "../Button";

type PaginationProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<"nav">;

function Pagination({ className, children }: PaginationProps) {
  return (
    <nav className={className}>
      <ul className="flex w-full mr-0 sm:w-auto sm:mr-auto">{children}</ul>
    </nav>
  );
}

interface LinkProps extends React.PropsWithChildren {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

Pagination.Link = ({ className, active, disabled, children, onClick }: LinkProps) => {
  return (
    <li className="flex-1 sm:flex-initial">
      <Button
        as="a"
        onClick={disabled ? undefined : onClick}
        className={twMerge([
          "min-w-0 sm:min-w-[40px] font-normal flex items-center justify-center text-slate-800 sm:mr-2 dark:text-slate-300 px-1 sm:px-3 h-full",
          active &&
            "rounded-[0.5rem] bg-white font-medium dark:bg-darkmode-400",
          !active && "shadow-none border-transparent",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        ])}
      >
        {children}
      </Button>
    </li>
  );
};

export default Pagination;
