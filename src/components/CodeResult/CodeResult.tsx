import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { CodeSearchResult } from '../../types';
import { highlightCode } from '../../utils/syntax';
import { CodeHeader } from './CodeHeader';
import { CodeSnippet } from './CodeSnippet';
import { useTheme } from '../../context/ThemeContext';

interface CodeResultProps {
  result: CodeSearchResult;
}

export default function CodeResult({ result }: CodeResultProps) {
  const codeRefs = useRef<(HTMLElement | null)[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    codeRefs.current.forEach((ref, i) => {
      if (ref && result.text_matches?.[i]) {
        highlightCode(ref, result.text_matches[i].fragment);
      }
    });
  }, [result, theme]); // テーマが変更された時も再ハイライト

  return (
    <motion.div
      className="border-b border-nord-4 dark:border-nord-2 last:border-b-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0 }}
    >
      <div className="py-3">
        <CodeHeader repository={result.repository} path={result.html_url} />
        {result.text_matches?.map((match, index) => (
          <CodeSnippet
            key={index}
            ref={el => codeRefs.current[index] = el}
            match={match}
          />
        ))}
      </div>
    </motion.div>
  );
}
