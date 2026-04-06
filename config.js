/**
 * ✨ EDIT THIS FILE to customize the birthday greeting! ✨
 */

const CONFIG = {
  // ── Recipient Info ────────────────────────────────────────────
  name: "Dea",
  photo: "./img/irene.jpg", 
  music: "./music/hbd.m4a",      

  // ── Theme Colors ──────────────────────────────────────────────
  colors: {
    primary: "#f9a8d4",   
    accent: "#93c5fd",    
    secondary: "#c4b5fd", 
    warm: "#fde68a",      
    mint: "#86efac",      

    dark: {
      background: "#0b1020",
      text: "#e2e8f0",
    },

    light: {
      background: "#fdfafc",
      text: "#334155",
    },
  },

  defaultMode: "dark",

  // ── Sections ──────────────────────────────────────────────────
  sections: [
    {
      type: "greeting",
      title: "Hi",
      subtitle: "I really like your name btw!",
    },
    {
      type: "announcement",
      text: "It's your birthday!! :D",
    },
    {
      type: "chatbox",
      message: "Happy birthday to youu!! Wishing you a wonderful year ahead filled with joy, love, and endless happiness!",
      buttonText: "Send",
    },
    {
      type: "ideas",
      lines: [
        "That's what I was going to do.",
        "But then I stopped.",
        "I realised, I wanted to do something <strong>special</strong>.",
        "Because,",
        "You are Special <span>:)</span>",
      ],
      bigLetters: "SO",
    },
    {
      type: "quote",
      text: "The more you praise and celebrate your life, the more there is in life to celebrate.",
      author: "Oprah Winfrey",
    },
    {
      type: "stars",
      count: 60,
    },
    {
      type: "balloons",
      count: 35, 
    },
    {
      type: "profile",
      title: "Happy Birthday!", 
      text: "May the js.prototypes always be with you! ;)", 
      image: "./img/irene.jpg",
    },
    {
      type: "confetti",
      count: 12,
    },
    {
      type: "fireworks",
      count: 24, 
    },
    
  ] // Removed trailing comma and closed properly
};