import * as lucideIcons from "lucide-react";
import { twMerge } from "tailwind-merge";

// Export all icons for external use
export const icons = lucideIcons;

interface LucideProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: keyof typeof lucideIcons;
  title?: string;
}

function Lucide(props: LucideProps) {
  const { icon, className, ...computedProps } = props;
  const Component = lucideIcons[props.icon] as React.ComponentType<any>;
  
  // Handle case where icon doesn't exist
  if (!Component) {
    console.warn(`Icon "${props.icon}" not found in lucide-react`);
    const { title, ...divProps } = computedProps;
    return (
      <div
        {...(divProps as React.HTMLAttributes<HTMLDivElement>)}
        className={twMerge(["w-5 h-5 border border-dashed border-gray-300", props.className])}
        title={title || `Missing icon: ${props.icon}`}
      />
    );
  }
  
  return (
    <Component
      {...computedProps}
      className={twMerge(["stroke-[1] w-5 h-5", props.className])}
    />
  );
}

export default Lucide;
