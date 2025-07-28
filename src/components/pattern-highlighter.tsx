"use client";

import React, { type ReactNode } from 'react';

type Match = {
  index: number;
  value: string;
};

export const PatternHighlighter = ({ text, matches }: { text: string; matches: Match[] }) => {
  if (matches.length === 0 || !text) {
    return <p className="break-all text-sm text-muted-foreground">{text || "No input string to display."}</p>;
  }

  const parts: ReactNode[] = [];
  let lastIndex = 0;

  // Create a sorted list of matches to process them in order without overlaps
  const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

  sortedMatches.forEach((match, i) => {
    // Add the text part before the current match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the highlighted match
    parts.push(
      <span key={`match-${i}`} className="rounded-sm bg-accent/30 font-medium text-accent-foreground">
        {match.value}
      </span>
    );
    
    lastIndex = match.index + match.value.length;
  });

  // Add the remaining text part after the last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return (
    <div className="break-all rounded-lg border bg-muted/50 p-4 leading-relaxed text-muted-foreground">
      {parts.map((part, index) => <React.Fragment key={index}>{part}</React.Fragment>)}
    </div>
  );
};
