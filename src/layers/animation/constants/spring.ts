import { Transition } from 'framer-motion';

export const springTransition: Transition = {
    type: "spring",
    bounce: 0.1,
    damping: 15,
    duration: 0.3
};
