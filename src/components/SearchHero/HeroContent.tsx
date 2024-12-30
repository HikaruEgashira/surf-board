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

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-md mx-auto">
          <h2 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
            🔑 GitHub Token Required
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            To use Surf Board, you'll need a GitHub personal access token with repository read permissions.
          </p>
          <div className="space-y-2">
            <a
              href="https://github.com/settings/tokens/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline block"
            >
              → Create a GitHub Token
            </a>
            <a
              href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline block"
            >
              → Learn more about GitHub tokens
            </a>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Get started by entering your search query above ↑
        </div>
      </div>
    </motion.div>
  );
}
