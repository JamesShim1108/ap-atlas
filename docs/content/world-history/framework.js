// This teaching framework belongs to this course. Other subjects can define their own.

export const framework = {
  id: "inspect",
  name: "InSPECT",
  title: "Use InSPECT to choose your evidence",
  intro:
    "A fact can connect to more than one lens. Choose the lens that helps answer the prompt.",
  sourceNote: "Based on the class Early Religions + InSPECT slides, pages 5-17.",
  themes: [
    {
      id: "In",
      title: "Interactions of humans with the environment",
      question: "How did geography, crops, resources, or disease shape choices?",
      example: "Andean terraces made steep slopes more usable for farming.",
      shortTitle: "Environment",
    },
    {
      id: "S",
      title: "Social interactions and organization",
      question: "Who had status, opportunities, or obligations?",
      example: "Examination preparation favored families that could afford education.",
      shortTitle: "Social",
    },
    {
      id: "P",
      title: "Political systems and governance",
      question: "How did rulers gain authority and administer territory?",
      example: "Song officials carried imperial decisions into local government.",
      shortTitle: "Political",
    },
    {
      id: "E",
      title: "Economic systems",
      question: "How were goods produced, exchanged, taxed, or distributed?",
      example: "Mali drew revenue from commerce through its territory.",
      shortTitle: "Economic",
    },
    {
      id: "C",
      title: "Cultural developments and interactions",
      question: "How did beliefs, learning, and artistic practices influence society?",
      example: "Buddhist monasteries connected religious practice with education.",
      shortTitle: "Cultural",
    },
    {
      id: "T",
      title: "Technology and innovation",
      question: "What techniques or tools changed what people could do?",
      example: "Inca roads and knotted records helped officials coordinate resources.",
      shortTitle: "Technology",
    },
  ],
};
