import { Variants } from 'framer-motion';
import { springTransition } from '../constants/spring';

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: {
        opacity: 1,
        y: 0,
        transition: springTransition
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: springTransition
    }
};

export const fadeIn: Variants = {
    initial: { opacity: 0, y: 5 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.15,
            ease: [0.4, 0, 1, 1]
        }
    }
};
