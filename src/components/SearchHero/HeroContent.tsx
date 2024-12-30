import { motion } from 'framer-motion';
import { Waves } from 'lucide-react';

export function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-4"
    >
      <div className="relative flex justify-center">
        <Waves className="w-10 h-10 text-blue-500 dark:text-blue-400" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-400
                           dark:from-blue-400 dark:to-blue-300
                           bg-clip-text text-transparent">
              Surf Board
            </span>
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Dive into GitHub's vast ocean of code
          </p>
        </div>
      </div>
    </motion.div>
  );
}
