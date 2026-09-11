// Original practice questions. correctAnswer is a zero-based choice index; never renumber existing IDs.

export const bank = {
  questions: [
    {
      id: "q1",
      topicId: "world-1-1",
      concept: "governance",
      difficulty: "Core",
      skillTag: "Explaining a development",
      prompt:
        "Why did examinations on Confucian writings help the Song government maintain its authority?",
      choices: [
        "They trained all citizens to vote for the emperor.",
        "They removed the need for officials in distant provinces.",
        "They helped recruit officials whose education reinforced ideas of hierarchy and duty.",
        "They reserved government office exclusively for hereditary nobles.",
      ],
      correctAnswer: 2,
      explanation:
        "The examinations connected recruitment with Confucian ideas about ethical conduct and relationships. Officials carried these ideas into administration; the system did not create elections or eliminate bureaucracy.",
    },
    {
      id: "q2",
      topicId: "world-1-1",
      concept: "governance",
      difficulty: "Apply",
      skillTag: "Using evidence",
      stimulus:
        "Two candidates hope to pass an imperial examination. One has family-funded tutors and years to study. The other must spend most days working to support his household.",
      prompt: "Which conclusion is best supported by this situation?",
      choices: [
        "Examinations offered a route to office, but resources affected a candidate’s opportunities.",
        "Examination results depended only on inherited noble titles.",
        "Every social group had the same chance of gaining a government post.",
        "Confucian education had no relationship to government service.",
      ],
      correctAnswer: 0,
      explanation:
        "Testing knowledge could create opportunities beyond noble birth, while unequal access to preparation favored wealthy families. This is a limit on equal opportunity, not evidence that exams did not matter.",
    },
    {
      id: "q3",
      topicId: "world-1-1",
      concept: "beliefs",
      difficulty: "Apply",
      skillTag: "Continuity and change",
      prompt:
        "Which description best captures continuity and change in Neo-Confucian thought?",
      choices: [
        "It rejected family obligations and replaced them with elected leadership.",
        "It preserved Confucian moral concerns while developing ideas in response to other traditions.",
        "It ended the practice of Buddhism across East Asia.",
        "It abandoned education as a means of developing ethical conduct.",
      ],
      correctAnswer: 1,
      explanation:
        "Neo-Confucianism kept Confucian ethics central but developed new interpretations in conversation and tension with Buddhist and Daoist ideas. Renewed tradition did not mean complete intellectual isolation.",
    },
    {
      id: "q4",
      topicId: "world-1-1",
      concept: "beliefs",
      difficulty: "Core",
      skillTag: "Explaining significance",
      prompt: "How could the Confucian emphasis on filial piety support imperial rule?",
      choices: [
        "It required children to select rulers through an examination.",
        "It prevented Buddhist ideas from reaching China.",
        "It transferred all government duties to merchants.",
        "It encouraged respect for hierarchical relationships that could extend from family to state.",
      ],
      correctAnswer: 3,
      explanation:
        "Duties within a family could help justify duties within a wider political hierarchy. Filial piety concerned respect and responsibility; it was not an electoral system or a ban on foreign religion.",
    },
    {
      id: "q5",
      topicId: "world-1-1",
      concept: "economy",
      difficulty: "Apply",
      skillTag: "Causation",
      prompt:
        "Which sequence best explains how agricultural innovation contributed to Song economic growth?",
      choices: [
        "Higher food output → support for population and specialized work → larger markets",
        "Higher food output → disappearance of farming → dependence only on imports",
        "More harvests → less need for transport → the closure of markets",
        "New rice varieties → an end to artisan production → fewer towns",
      ],
      correctAnswer: 0,
      explanation:
        "A larger food supply could support more people and more specialized occupations, helping markets expand. Agriculture remained central, and irrigation, tools, and transport also contributed.",
    },
    {
      id: "q6",
      topicId: "world-1-1",
      concept: "economy",
      difficulty: "Apply",
      skillTag: "Using evidence",
      stimulus:
        "A village workshop makes porcelain for buyers in distant cities. Boats carry its output along waterways, and merchants arrange sales beyond the local community.",
      prompt: "This situation most directly illustrates which development?",
      choices: [
        "A return to producing only for household consumption",
        "The replacement of artisan work by steam-powered factories",
        "The growing importance of production for markets and regional trade",
        "The elimination of farming from the Chinese economy",
      ],
      correctAnswer: 2,
      explanation:
        "Production for distant buyers shows commercialization. Artisans and peasants still supplied goods; market growth in the Song period was not the same as later factory industrialization.",
    },
    {
      id: "q7",
      topicId: "world-1-1",
      concept: "influence",
      difficulty: "Apply",
      skillTag: "Comparison",
      prompt: "Which comparison of Song China and medieval Japan is most accurate?",
      choices: [
        "Both were administered entirely by elected religious leaders.",
        "Both experienced Chinese and Buddhist cultural influences, but Japan’s warrior elites differed from Song scholar-officials.",
        "Neither developed political institutions influenced by local traditions.",
        "Japan’s adoption of Chinese culture made it a province governed by Song officials.",
      ],
      correctAnswer: 1,
      explanation:
        "Cultural borrowing coexisted with political differences. Song administration relied heavily on scholar-officials, while warrior leadership grew central in Japan. Shared culture does not prove shared rule.",
    },
    {
      id: "q8",
      topicId: "world-1-1",
      concept: "influence",
      difficulty: "Apply",
      skillTag: "Historical reasoning",
      prompt:
        "A historian finds Chinese-derived writing and Confucian learning in Korea and Vietnam. What additional evidence would best show local adaptation?",
      choices: [
        "Records that both regions had contact with China",
        "Examples of books arriving from Chinese ports",
        "Evidence that Chinese scholars valued literacy",
        "Records showing that each region modified borrowed institutions to suit its own elites and traditions",
      ],
      correctAnswer: 3,
      explanation:
        "Adaptation means reshaping what is borrowed. Evidence of local modifications shows more than contact or simple adoption and helps explain why societies remained distinct.",
    },
    {
      id: "k1",
      topicId: "world-1-1",
      concept: "governance",
      difficulty: "Quick check",
      skillTag: "Concept check",
      prompt: "Which example describes a bureaucracy?",
      choices: [
        "A ruler handling every tax dispute personally",
        "Appointed officials managing taxes and carrying out imperial policies",
        "Merchants choosing the emperor through a market vote",
        "Families independently issuing all government laws",
      ],
      correctAnswer: 1,
      explanation:
        "A bureaucracy divides government work among appointed officials. In Song China, these officials helped put imperial policies into practice across a large territory.",
    },
    {
      id: "k2",
      topicId: "world-1-1",
      concept: "economy",
      difficulty: "Quick check",
      skillTag: "Causation",
      prompt: "Why did early-ripening rice matter beyond agriculture?",
      choices: [
        "It made transport networks unnecessary.",
        "It immediately gave all farmers government jobs.",
        "It ended the need for other agricultural improvements.",
        "It helped increase the food supply that supported people doing specialized work.",
      ],
      correctAnswer: 3,
      explanation:
        "Increased food output helped support a growing population and people working in crafts and trade. Early-ripening rice worked alongside other agricultural changes.",
    },
    {
      id: "k3",
      topicId: "world-1-1",
      concept: "beliefs",
      difficulty: "Quick check",
      skillTag: "Concept check",
      prompt:
        "Which statement best describes the relationship between Confucianism and Buddhism in East Asia?",
      choices: [
        "They could coexist and influence intellectual and cultural life in different ways.",
        "They were the same tradition under two names.",
        "The spread of one instantly removed the other everywhere.",
        "Neither influenced life beyond the Chinese imperial court.",
      ],
      correctAnswer: 0,
      explanation:
        "Multiple traditions coexisted, sometimes in tension and sometimes influencing each other. Their influence reached societies beyond China and extended beyond government.",
    },
  ],
  quizzes: [
    {
      id: "world-1-1-quiz",
      courseId: "world",
      unitId: "world-1",
      topicId: "world-1-1",
      title: "East Asia topic quiz",
      quizType: "topic",
      questionIds: ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"],
    },
    {
      id: "world-1-1-quick",
      courseId: "world",
      unitId: "world-1",
      topicId: "world-1-1",
      title: "East Asia quick practice",
      quizType: "quick",
      questionIds: ["k1", "k2", "k3"],
    },
  ],
};
