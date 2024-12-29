export function highlightCode(fragment: string, matches: Array<{ indices: [number, number] }>): string {
  let result = fragment;
  let offset = 0;

  matches.sort((a, b) => a.indices[0] - b.indices[0]).forEach(match => {
    const [start, end] = match.indices;
    const highlightStart = `<span class="bg-yellow-200 dark:bg-yellow-900">`;
    const highlightEnd = '</span>';
    
    result = 
      result.slice(0, start + offset) +
      highlightStart +
      result.slice(start + offset, end + offset) +
      highlightEnd +
      result.slice(end + offset);
    
    offset += highlightStart.length + highlightEnd.length;
  });

  return result;
}