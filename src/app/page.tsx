"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Search, List, TextCursorInput, LoaderCircle } from 'lucide-react';
import { PatternHighlighter } from '@/components/pattern-highlighter';

type Match = {
  index: number;
  value: string;
};

export default function Home() {
  const [inputString, setInputString] = useState("ABDCKDHJABDCBDAUOQJDBADCLDLCHBCBABCBAABCDAJDBABDCABDABDBCADBCASSJGABCDAUTACBDBQWUDNCDBCADKDHABDJGBDABCBDBADCACADBADBCBAD");
  const [pattern, setPattern] = useState("ABCD");
  const [results, setResults] = useState<Match[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const sortedPattern = useMemo(() => {
    return pattern.split('').sort().join('');
  }, [pattern]);

  const findPatterns = () => {
    if (!inputString || !pattern) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setHasSearched(false);
    setResults([]);

    // Use a short timeout to allow the UI to update to the loading state
    setTimeout(() => {
      const foundMatches: Match[] = [];
      const patternLength = pattern.length;

      if (patternLength > 0) {
        for (let i = 0; i <= inputString.length - patternLength; i++) {
          const sub = inputString.substring(i, i + patternLength);
          const sortedSub = sub.split('').sort().join('');
          if (sortedSub === sortedPattern) {
            foundMatches.push({ index: i, value: sub });
          }
        }
      }

      setResults(foundMatches);
      setIsSearching(false);
      setHasSearched(true);
    }, 50);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline sm:text-5xl">Pattern Finder</h1>
          <p className="mt-4 text-lg text-muted-foreground">Find all sequential permutations of a pattern in a string.</p>
        </header>

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="text-primary" />
              Search Configuration
            </CardTitle>
            <CardDescription>Enter the string and the pattern to search for.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="input-string" className="flex items-center gap-1.5">
                <TextCursorInput className="h-4 w-4" />
                Input String
              </Label>
              <Input
                id="input-string"
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
                placeholder="e.g., BACDGABCDA"
                className="font-mono text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pattern" className="flex items-center gap-1.5">
                <TextCursorInput className="h-4 w-4" />
                Pattern
              </Label>
              <Input
                id="pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g., ABCD"
                className="font-mono text-base"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={findPatterns} disabled={isSearching || !inputString || !pattern} className="w-full sm:w-auto">
              {isSearching ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Patterns
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {(hasSearched || isSearching) && (
          <Card className="w-full animate-in fade-in-50 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="text-primary" />
                Results
              </CardTitle>
              <CardDescription>
                {isSearching
                  ? "Searching for matches..."
                  : `Found ${results.length} match${results.length !== 1 ? 'es' : ''} for the pattern "${pattern}".`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                  <h3 className="mb-2 text-base font-semibold">Highlighted String</h3>
                  <PatternHighlighter text={inputString} matches={results} />
              </div>
              <div>
                <h3 className="mb-2 text-base font-semibold">Found Occurrences</h3>
                {isSearching ? (
                  <div className="space-y-2">
                    <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto rounded-lg border">
                    <ul className="divide-y divide-border">
                      {results.map((match) => (
                        <li key={match.index} className="flex items-center justify-between p-3 transition-colors hover:bg-muted/50">
                          <span className="text-sm text-muted-foreground">Index: <span className="font-bold text-foreground">{match.index}</span></span>
                          <code className="rounded-md bg-muted px-2 py-1 text-sm font-semibold text-primary">{match.value}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                    <p className="font-medium text-muted-foreground">No patterns found.</p>
                    <p className="text-sm text-muted-foreground/80">Try using a different string or pattern.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
