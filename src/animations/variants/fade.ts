import { Variants } from 'framer-motion';
import { springTransition } from '../constants/spring';

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            ...springTransition,
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        scale: 0.96,
        transition: {
            duration: 0.15,
            ease: [0.32, 0, 0.67, 0]
        }
    }
};

export const fadeIn: Variants = {
    initial: { opacity: 0, y: 5, scale: 0.99 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.25,
            ease: [0.33, 1, 0.68, 1]
        }
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        y: -8,
        transition: {
            duration: 0.2,
            ease: [0.32, 0, 0.67, 0],
            scale: {
                duration: 0.15,
                ease: [0.65, 0, 0.35, 1]
            }
        }
    }
};
