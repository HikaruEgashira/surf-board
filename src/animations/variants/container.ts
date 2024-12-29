import { Variants } from 'framer-motion';

export const searchContainer: Variants = {
    initial: {},
    animate: {
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 1
        }
    }
};
