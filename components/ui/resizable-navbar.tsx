"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

import React, { useRef, useState } from "react";


interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
    dropdown?: {
      name: string;
      link: string;
    }[];
  }[];
  className?: string;
  onItemClick?: () => void;
  visible?: boolean;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-0 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  // List of components that accept visible prop
  const componentsWithVisible = ['NavItems', 'NavbarLogo', 'NavbarButton'];
  
  // Recursive function to clone children and pass visible prop to target components
  const cloneChildrenWithVisible = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const childType = child.type as any;
        const componentName = childType?.displayName || childType?.name || '';
        
        // If this is a target component, pass visible prop
        if (componentsWithVisible.includes(componentName)) {
          return React.cloneElement(
            child as React.ReactElement<{ visible?: boolean }>,
            { visible }
          );
        }
        
        // If this is a regular HTML element with children, recursively process its children
        if (typeof childType === 'string' && child.props && (child.props as any).children) {
          return React.cloneElement(child as React.ReactElement<any>, {
            children: cloneChildrenWithVisible((child.props as any).children)
          });
        }
      }
      return child;
    });
  };
  
  return (
    <motion.div
      initial={{
        maxWidth: "1408px",
        y: 20,
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        maxWidth: visible ? "1024px" : "1408px",
        y: 20,
        paddingLeft: visible ? "1rem" : "1rem",
        paddingRight: visible ? "1rem" : "1rem",
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full bg-transparent py-2 lg:flex dark:bg-transparent md:px-6 lg:px-12 xl:px-16",
        visible && "bg-white/40 dark:bg-neutral-950/40",
        className,
      )}
    >
      {cloneChildrenWithVisible(children)}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick, visible }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => {
        setHovered(null);
        setDropdownOpen(null);
      }}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium transition duration-200 lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <div
          key={`link-${idx}`}
          className="relative"
          onMouseEnter={() => {
            setHovered(idx);
            if (item.dropdown) setDropdownOpen(idx);
          }}
          onMouseLeave={() => {
            if (!item.dropdown) setDropdownOpen(null);
          }}
        >
          <a
            onClick={onItemClick}
            className={cn(
              "relative px-4 py-2 transition-colors block",
              visible 
                ? "text-neutral-600 dark:text-neutral-300" 
                : "text-white"
            )}
            href={item.link}
          >
            {hovered === idx && (
              <motion.div
                layoutId="hovered"
                className={cn(
                  "absolute inset-0 h-full w-full rounded-full",
                  visible 
                    ? "bg-gray-100 dark:bg-neutral-800" 
                    : "bg-white/10"
                )}
              />
            )}
            <span className="relative z-20 flex items-center gap-1">
              {item.name}
              {item.dropdown && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </span>
          </a>
          {item.dropdown && dropdownOpen === idx && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "absolute top-full left-0 mt-1 w-48 rounded-xl shadow-lg py-2 z-50",
                visible
                  ? "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800"
                  : "border border-white/20 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/70"
              )}
            >
              {item.dropdown.map((dropItem, dropIdx) => (
                <a
                  key={`dropdown-${idx}-${dropIdx}`}
                  href={dropItem.link}
                  onClick={onItemClick}
                  className={cn(
                    "block px-4 py-2 text-sm transition-colors rounded-lg mx-1",
                    visible
                      ? "text-neutral-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      : "text-neutral-600 hover:bg-white/50 dark:text-neutral-300 dark:hover:bg-white/10"
                  )}
                >
                  {dropItem.name}
                </a>
              ))}
            </motion.div>
          )}
        </div>
      ))}
    </motion.div>
  );
};

NavItems.displayName = 'NavItems';

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
        visible && "bg-white/40 dark:bg-neutral-950/40",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] dark:bg-neutral-950",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <IconX className="text-black dark:text-white" onClick={onClick} />
  ) : (
    <IconMenu2 className="text-black dark:text-white" onClick={onClick} />
  );
};

export const NavbarLogo = ({ children, visible }: { children?: React.ReactNode; visible?: boolean }) => {
  return (
    <div className={cn(
      "relative z-20 mr-4 flex items-center space-x-2 px-2 py-1",
      "[&_span]:transition-colors",
      visible ? "[&_span]:text-neutral-600 dark:[&_span]:text-white" : "[&_span]:text-white"
    )}>
      {children || (
        <>
          <img
            src="https://assets.aceternity.com/logo-dark.png"
            alt="logo"
            width={30}
            height={30}
          />
          <span className="font-medium">
            Startup
          </span>
        </>
      )}
    </div>
  );
};

NavbarLogo.displayName = 'NavbarLogo';

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  visible,
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
  visible?: boolean;
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-4 py-2.5 rounded-md button text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-flex items-center justify-center text-center min-h-[44px]";

  const variantStyles = {
    primary:
      "bg-white text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    secondary: visible 
      ? "bg-transparent shadow-none text-neutral-600 dark:text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-300"
      : "bg-transparent shadow-none text-white hover:text-white",
    dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    gradient:
      "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,_0.3)_inset]",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

NavbarButton.displayName = 'NavbarButton';
