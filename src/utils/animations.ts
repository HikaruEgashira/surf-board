import { Transition } from 'framer-motion';

export const springTransition: Transition = {
    type: "spring",
    bounce: 0.1,
    damping: 15,
    duration: 0.3
};

export const fadeInUpAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: springTransition
};

export const fadeInAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0 }
};
