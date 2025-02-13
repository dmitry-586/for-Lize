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
  y: number;
  size: number;
  duration: number;
  finalX?: number;
  finalY?: number;
}

const messages = [
  "Любовь всей моей жизни, я сделал это специально for you! Просто кликай в любое место на экране, чтобы прочитать следующее сообщение)",
  "Тут будет немного compliments about you!",
  "Ты у меня мега супер красивая, могу бесконечно наслаждаться твоей красотой)",
  "Я тебя обожаю, и с каждым днем это чувство становится только сильнее!",
  "Люблю тебя больше всего на свете, и это самое искреннее, что я могу сказать",
  "Ты лучше всех, и я кайфую от тебя!!!",
];

const MAX_HEARTS = 30;

export default function LoveCard() {
  const [hearts, setHearts] = useState<HeartProps[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isFinal, setIsFinal] = useState(false);
  const { width, height } = useWindowSize();

  const generateHeartShape = useCallback(() => {
    const centerX = width / 2;
    const centerY = height / 2 - 50;
    const heartSize = Math.min(width, height) * 0.5; // Увеличиваем общий объем сердца
    const points = [];

    // Увеличиваем количество точек для большего объема
    for (let t = 0; t < 2 * Math.PI; t += 0.08) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -1 * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      points.push({
        x: centerX + (x * heartSize) / 30,
        y: centerY + (y * heartSize) / 30,
      });
    }
    return points;
  }, [width, height]);

  const createHeart = useCallback(() => ({
    id: uuidv4(),
    x: Math.random() * width,
    y: height + 100,
    size: Math.random() * 15 + 15,
    duration: Math.random() * 3 + 4,
  }), [width, height]);

  useEffect(() => {
    if (!isFinal) {
      const interval = setInterval(() => {
        setHearts(prev => 
          prev.length < MAX_HEARTS 
            ? [...prev, createHeart()] 
            : prev
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFinal, createHeart]);

  const handleClick = () => {
    if (messageIndex < messages.length - 1) {
      setMessageIndex(prev => prev + 1);
    } else if (!isFinal) {
      setIsFinal(true);
      const points = generateHeartShape();
      setHearts(points.map(p => ({
        id: uuidv4(),
        x: Math.random() * width,
        y: Math.random() * height,
        size: 10, // Уменьшаем размер финальных сердечек
        duration: 2,
        finalX: p.x,
        finalY: p.y,
      })));
    }
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
          initial={{ 
            x: heart.x,
            y: heart.y,
            scale: isFinal ? 0.5 : 1,
            opacity: 1
          }}
          animate={{ 
            x: isFinal ? heart.finalX : heart.x,
            y: isFinal ? heart.finalY : -100,
            scale: isFinal ? 1 : 0.8
          }}
          transition={{
            duration: isFinal ? 2 : heart.duration,
            ease: "backOut",
            repeat: isFinal ? 0 : Infinity
          }}
          style={{
            position: "absolute",
            fontSize: heart.size,
            color: "#ff4d4f",
            pointerEvents: "none",
            transformOrigin: 'center center'
          }}
        >
          <HeartFilled />
        </motion.div>
      ))}

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          width: "min(90vw, 500px)",
          padding: "0 20px",
          boxSizing: "border-box"
        }}
      >
        <AnimatePresence mode="wait">
          {!isFinal && (
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              style={{
                textAlign: "center",
                fontSize: "clamp(16px, 4vw, 22px)",
                color: "#ff4d4f",
                padding: "20px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
              }}
            >
              {messages[messageIndex]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}