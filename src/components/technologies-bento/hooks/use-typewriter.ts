import { useState, useEffect, useRef } from 'react';

export const useTypewriter = (fullText: string, speed: number = 50, delay: number = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    
    let currentIndex = 0;
    
    const typeChar = () => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeChar, speed + Math.random() * 20);
      } else {
        setIsTyping(false);
      }
    };

    const initialTimeout = setTimeout(() => {
      typeChar();
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearTimeout(initialTimeout);
    };
  }, [fullText, speed, delay]);

  return { displayedText, isTyping };
};
