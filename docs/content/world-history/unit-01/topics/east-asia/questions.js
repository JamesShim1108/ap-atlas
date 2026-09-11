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
        "They recruited officials mainly for military experience, reducing the dynasty’s reliance on civilian administrators.",
        "They gave wealthy provincial families the right to appoint officials who owed loyalty to local elites.",
        "They helped recruit officials whose education reinforced ideas of hierarchy and duty.",
        "They made the emperor’s authority depend on approval from officials selected by regional assemblies.",
      ],
      correctAnswer: 2,
      explanation:
        "The examinations connected recruitment with Confucian ideas about ethical conduct and hierarchy. They trained civilian administrators loyal to the imperial system rather than military officers, hereditary appointees, or elected representatives.",
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
        "Only hereditary nobles could sit for the exams, so preparation did not matter.",
        "Family wealth, rather than exam performance, directly determined official scores.",
        "Because the exams rewarded merit, unequal preparation did not affect mobility.",
      ],
      correctAnswer: 0,
      explanation:
        "Testing knowledge could create opportunities beyond noble birth, while unequal access to preparation favored wealthy families. Wealth influenced preparation and opportunity, but it did not legally restrict the exams to nobles or directly determine a candidate’s score.",
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
        "It preserved Confucian social hierarchy but rejected Buddhist and Daoist ideas as incompatible with Chinese traditions.",
        "It preserved Confucian moral concerns while developing ideas in response to other traditions.",
        "It combined Buddhist meditation with civil-service training to create a state religion enforced throughout East Asia.",
        "It revived classical Confucian texts while shifting moral authority from families and rulers to Buddhist monasteries.",
      ],
      correctAnswer: 1,
      explanation:
        "Neo-Confucianism kept Confucian ethics and hierarchy central while developing ideas in conversation with Buddhism and Daoism. It neither rejected those influences completely nor transferred authority to Buddhist institutions.",
    },
    {
      id: "q4",
      topicId: "world-1-1",
      concept: "beliefs",
      difficulty: "Core",
      skillTag: "Explaining significance",
      prompt: "How could the Confucian emphasis on filial piety support imperial rule?",
      choices: [
        "It taught respect for family elders while discouraging people from applying those duties to political rulers.",
        "It justified imperial authority mainly by promising equal social rank to every obedient subject.",
        "It shifted loyalty away from kinship groups and toward Buddhist monasteries supervised by the state.",
        "It encouraged respect for hierarchical relationships that could extend from family to state.",
      ],
      correctAnswer: 3,
      explanation:
        "Filial piety linked duties within the family to respect for authority in a wider political hierarchy. Its political importance came from extending hierarchy, not separating family ethics from government or promising social equality.",
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
        "Higher food output → population growth → declining demand for artisan goods as workers returned to subsistence farming",
        "New rice varieties → more land under cultivation → less need for canals and commercial transport",
        "More harvests → lower government revenues → contraction of cities and long-distance trade",
      ],
      correctAnswer: 0,
      explanation:
        "A larger food supply supported population growth and workers in specialized occupations, which expanded towns and markets. Agricultural gains increased rather than reduced the value of artisan production and transport networks.",
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
        "The growth of home-based production intended mainly for local household consumption",
        "The expansion of state-supervised workshops that produced porcelain only as tribute for the emperor",
        "The growing importance of production for markets and regional trade",
        "The spread of rural proto-industrial production powered by mechanized steam equipment",
      ],
      correctAnswer: 2,
      explanation:
        "Production for distant buyers shows commercialization and proto-industrial market production. The key evidence is sale beyond the local community, not household consumption, tribute-only production, or later steam-powered industry.",
    },
    {
      id: "q7",
      topicId: "world-1-1",
      concept: "influence",
      difficulty: "Apply",
      skillTag: "Comparison",
      prompt: "Which comparison of Song China and medieval Japan is most accurate?",
      choices: [
        "Both borrowed Chinese political models and relied primarily on scholar-officials selected through civil-service examinations.",
        "Both experienced Chinese and Buddhist cultural influences, but Japan’s warrior elites differed from Song scholar-officials.",
        "Both adopted Buddhism, but Song rulers placed political authority in monasteries while Japan retained secular rule.",
        "Both developed warrior governments, although Japan’s shogunate was more centralized than Song military rule.",
      ],
      correctAnswer: 1,
      explanation:
        "Cultural borrowing coexisted with political differences. Song administration relied heavily on scholar-officials, while warrior leadership grew central in Japan; Japan did not simply reproduce China’s examination bureaucracy.",
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
        "Records showing Korean and Vietnamese elites used Chinese writing in government documents",
        "Evidence that Korea and Vietnam maintained tributary and diplomatic relations with Chinese dynasties",
        "Records showing rulers copied China’s examination curriculum without adapting it",
        "Records showing that each region modified borrowed institutions to suit its own elites and traditions",
      ],
      correctAnswer: 3,
      explanation:
        "Adaptation means reshaping what is borrowed. Writing, diplomacy, and an unaltered exam curriculum would demonstrate contact or adoption; local modifications specifically show adaptation.",
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
