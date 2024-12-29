import { motion, AnimatePresence } from 'framer-motion';
import CodeResult from '../CodeResult';
import type { CodeSearchResult } from '../../types';
import { fadeIn } from '../../animations';
import { containerStyles } from '../../utils/styles';

interface SearchResultsProps {
  results: CodeSearchResult[];
  isLoading: boolean;
}

export default function SearchResults({ results }: SearchResultsProps) {
  const getResultKey = (result: CodeSearchResult) => {
    return `${result.sha}-${result.repository?.full_name}-${result.path}`;
  };

  const renderResults = () => {
    if (results.length === 0) {
      return null;
    }

    return results.map((result) => (
      <div key={getResultKey(result)}>
        <motion.div {...fadeIn}>
          <CodeResult result={result} />
        </motion.div>
      </div>
    ));
  };

  return (
    <div className={containerStyles}>
      <AnimatePresence>
        {renderResults()}
      </AnimatePresence>
    </div>
  );
}
