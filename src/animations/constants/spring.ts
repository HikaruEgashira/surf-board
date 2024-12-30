import { Transition } from 'framer-motion';

export const springTransition: Transition = {
    type: "spring",
    bounce: 0,
    damping: 20,
    stiffness: 300,
    mass: 0.8,
    restDelta: 0.001
};
