// components/LoveCard.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartFilled } from "@ant-design/icons";
import { useWindowSize } from "react-use";
import { v4 as uuidv4 } from "uuid";
import "./globals.css";

interface HeartProps {
  id: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

const messages = [
  "Ты самая красивая",
  "Я тебя обожаю",
  "Ты моё счастье",
  "Люблю тебя больше всего на свете",
  "Ты лучше всех!",
];

export default function LoveCard() {
  const [hearts, setHearts] = useState<HeartProps[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const { width, height } = useWindowSize();

  const createHeart = useCallback(
    (): HeartProps => ({
      id: uuidv4(),
      x: Math.random() * (width - 100),
      size: Math.random() * 30 + 20,
      duration: Math.random() * 3 + 4,
      delay: Math.random() * 2,
    }),
    [width]
  );

  useEffect(() => {
    const initHearts = Array.from({ length: 20 }, () => createHeart());
    setHearts(initHearts);
  }, [createHeart]);

  const handleClick = () => {
    setHearts([...hearts, createHeart()]);
    setMessageIndex((prev) => (prev + 1) % messages.length);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#F2E9EE",
        cursor: "pointer",
      }}
    >
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: height + 100, opacity: 1 }}
          animate={{ y: -100, opacity: 0 }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{
            position: "absolute",
            left: heart.x,
            fontSize: heart.size,
            color: "#ff4d4f",
          }}
        >
          <HeartFilled />
        </motion.div>
      ))}

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          textAlign: "center",
          width: "300px"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="container"
            style={{
              fontSize: "22px",
              color: "#fff",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              padding: "20px",
              borderRadius: "20px",
            }}
          >
            {messages[messageIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
