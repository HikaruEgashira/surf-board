import { Variants } from 'framer-motion';

export const skeletonFade: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};
