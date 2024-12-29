interface SearchFilter {
  key: string;
  value: string;
}

export function parseSearchQuery(query: string): SearchFilter[] {
  const filters: SearchFilter[] = [];
  const parts = query.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

  parts.forEach(part => {
    const colonIndex = part.indexOf(':');
    if (colonIndex > 0) {
      const key = part.slice(0, colonIndex);
      let value = part.slice(colonIndex + 1);
      
      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      filters.push({ key, value });
    } else if (part) {
      filters.push({ key: 'text', value: part });
    }
  });

  return filters;
}

export function stringifySearchQuery(filters: SearchFilter[]): string {
  return filters.map(filter => {
    if (filter.key === 'text') return filter.value;
    const value = filter.value.includes(' ') ? `"${filter.value}"` : filter.value;
    return `${filter.key}:${value}`;
  }).join(' ');
}