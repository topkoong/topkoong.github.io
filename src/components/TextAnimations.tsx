// Framer Motion Text Animations
// Based on https://ui.indie-starter.dev/docs/text-animation

import React from 'react';
import { motion } from 'framer-motion';

// Gradual Spacing Animation
export const GradualSpacing: React.FC<{ text: string; className?: string }> = ({ 
  text, 
  className = "text-4xl font-bold" 
}) => {
  const letters = text.split('');

  return (
    <div className={`flex ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </div>
  );
};

// Typing Effect Animation
export const TypingEffect: React.FC<{ 
  text: string; 
  className?: string;
  speed?: number;
  showCursor?: boolean;
}> = ({ 
  text, 
  className = "text-2xl font-medium",
  speed = 100,
  showCursor = true
}) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className={className}>
      <span>{displayedText}</span>
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="ml-1"
        >
          |
        </motion.span>
      )}
    </div>
  );
};

// Staggered Fade Animation
export const StaggeredFade: React.FC<{ 
  words: string[]; 
  className?: string;
  delay?: number;
}> = ({ 
  words, 
  className = "text-xl",
  delay = 0.2
}) => {
  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: index * delay,
            ease: "easeOut"
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

// Rotate Words Animation
export const RotateWords: React.FC<{ 
  words: string[]; 
  className?: string;
  duration?: number;
}> = ({ 
  words, 
  className = "text-2xl font-semibold",
  duration = 2
}) => {
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <div className={className}>
      <span className="mr-2">You can</span>
      <motion.span
        key={currentWordIndex}
        initial={{ opacity: 0, rotateX: -90 }}
        animate={{ opacity: 1, rotateX: 0 }}
        exit={{ opacity: 0, rotateX: 90 }}
        transition={{ duration: 0.5 }}
        className="inline-block text-blue-600 dark:text-blue-400"
      >
        {words[currentWordIndex]}
      </motion.span>
    </div>
  );
};

// Letters Pull Up Animation
export const LettersPullUp: React.FC<{ 
  text: string; 
  className?: string;
}> = ({ 
  text, 
  className = "text-3xl font-bold" 
}) => {
  const letters = text.split('');

  return (
    <div className={`flex ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: index * 0.05,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </div>
  );
};

// Words Pull Up Animation
export const WordsPullUp: React.FC<{ 
  text: string; 
  className?: string;
}> = ({ 
  text, 
  className = "text-xl" 
}) => {
  const words = text.split(' ');

  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

// Blur In Animation
export const BlurIn: React.FC<{ 
  text: string; 
  className?: string;
  delay?: number;
}> = ({ 
  text, 
  className = "text-xl",
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ filter: 'blur(10px)', opacity: 0 }}
      animate={{ filter: 'blur(0px)', opacity: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {text}
    </motion.div>
  );
};

// Fade Up Animation
export const FadeUp: React.FC<{ 
  text: string; 
  className?: string;
  delay?: number;
}> = ({ 
  text, 
  className = "text-lg",
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {text}
    </motion.div>
  );
};

// Fade Down Animation
export const FadeDown: React.FC<{ 
  text: string; 
  className?: string;
  delay?: number;
}> = ({ 
  text, 
  className = "text-lg",
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {text}
    </motion.div>
  );
};

// Container for scroll-triggered animations
export const ScrollAnimation: React.FC<{ 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ 
  children, 
  className = "",
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
