import { Transition } from 'framer-motion';

export const springTransition: Transition = {
    type: "spring",
    bounce: 0,
    damping: 25,
    stiffness: 200,
    mass: 0.6,
    restDelta: 0.001,
};
