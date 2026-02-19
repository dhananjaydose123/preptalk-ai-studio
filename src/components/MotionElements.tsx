import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";

export const MotionCard = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { children: React.ReactNode }
>(({ children, ...props }, ref) => (
  <motion.div
    ref={ref}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    {...props}
  >
    {children}
  </motion.div>
));
MotionCard.displayName = "MotionCard";

export const MotionButton = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { children: React.ReactNode }
>(({ children, ...props }, ref) => (
  <motion.div
    ref={ref}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 500, damping: 25 }}
    {...props}
  >
    {children}
  </motion.div>
));
MotionButton.displayName = "MotionButton";

export const MotionStagger = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.08 } },
    }}
  >
    {children}
  </motion.div>
);

export const MotionItem = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    }}
  >
    {children}
  </motion.div>
);
