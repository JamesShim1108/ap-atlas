// Original practice questions. correctAnswer is a zero-based choice index; never renumber existing IDs.

export const bank = {
  questions: [
    {
      id: "world-1-6-q1",
      topicId: "world-1-6",
      concept: "europe-power",
      prompt: "Why did many medieval European monarchs depend on local nobles?",
      choices: [
        "Every noble passed a centrally administered Confucian examination.",
        "Nobles controlled land, armed followers, and resources the monarch could not easily administer directly.",
        "No monarch claimed authority over territory.",
        "Nobles lacked any connection to agricultural production.",
      ],
      correctAnswer: 1,
      explanation:
        "Limits on revenue and direct administration made local power holders important. Monarchical authority varied across regions.",
      difficulty: "Apply",
      skillTag: "Causation",
    },
    {
      id: "world-1-6-q2",
      topicId: "world-1-6",
      concept: "europe-manors",
      prompt:
        "Which distinction between feudal relationships and manorialism is most useful?",
      choices: [
        "Feudal ties linked elites through land and service; manorialism organized estate production and peasant obligations.",
        "Feudalism governed only trade at sea; manorialism governed only universities.",
        "They were identical systems with no meaningful distinction.",
        "Manorialism required all peasants to be free of obligations.",
      ],
      correctAnswer: 0,
      explanation:
        "The two could reinforce one another while describing different relationships. Not every peasant had the same status.",
      difficulty: "Apply",
      skillTag: "Comparison",
    },
    {
      id: "world-1-6-q3",
      topicId: "world-1-6",
      concept: "europe-faith",
      prompt:
        "Which example shows the Church functioning as more than a place of worship?",
      choices: [
        "A merchant uses an Andean terrace.",
        "A ruler abolishes every religious institution in Europe.",
        "A guild operates without any local community.",
        "A monastery manages land, supports a school, and influences regional patrons.",
      ],
      correctAnswer: 3,
      explanation:
        "Religious institutions also held resources, promoted education, and participated in political relationships.",
      difficulty: "Apply",
      skillTag: "Using evidence",
    },
    {
      id: "world-1-6-q4",
      topicId: "world-1-6",
      concept: "europe-faith",
      prompt: "Which statement best describes religious life in medieval Europe?",
      choices: [
        "Every person followed the same Christian church.",
        "Religious difference prevented all translation or trade.",
        "Christianity was influential alongside Jewish and Muslim communities, with both exchange and persecution.",
        "All religious communities enjoyed identical legal rights everywhere.",
      ],
      correctAnswer: 2,
      explanation:
        "Europe included several religious traditions and unequal relationships. Neither uniformity nor universal equality fits the evidence.",
      difficulty: "Apply",
      skillTag: "Explaining a development",
    },
    {
      id: "world-1-6-q5",
      topicId: "world-1-6",
      concept: "europe-agriculture",
      prompt: "How could agricultural improvements contribute to town growth?",
      choices: [
        "Every improvement immediately ended estate labor obligations.",
        "Additional food could support people working in crafts, trade, and other urban occupations.",
        "Crop rotation eliminated the need for farmers.",
        "Higher output made regional exchange unnecessary.",
      ],
      correctAnswer: 1,
      explanation:
        "A surplus supported specialization, but technology worked alongside climate, land, and labor.",
      difficulty: "Apply",
      skillTag: "Causation",
    },
    {
      id: "world-1-6-q6",
      topicId: "world-1-6",
      concept: "europe-agriculture",
      prompt:
        "Which explanation best connects the Black Death to changing labor relations in parts of western Europe?",
      choices: [
        "Fewer workers could increase labor’s bargaining power, while elites tried to preserve obligations.",
        "Population losses guaranteed higher rents for every lord.",
        "The plague caused serfdom to end immediately everywhere.",
        "Disease had no possible economic consequences.",
      ],
      correctAnswer: 0,
      explanation:
        "Labor scarcity could change bargaining, but laws, coercion, and regional differences shaped outcomes.",
      difficulty: "Apply",
      skillTag: "Causation",
    },
    {
      id: "world-1-6-q7",
      topicId: "world-1-6",
      concept: "europe-exchange",
      prompt:
        "Why is the Fourth Crusade’s attack on Constantinople important for interpreting religious conflict?",
      choices: [
        "Every crusade was a peaceful trading expedition.",
        "Constantinople was the capital of the Mexica state.",
        "All Christian governments permanently merged after 1204.",
        "Political and commercial interests could lead crusaders to attack other Christians.",
      ],
      correctAnswer: 3,
      explanation:
        "The event complicates an explanation based only on opposing religious labels. Motives and alliances varied.",
      difficulty: "Apply",
      skillTag: "Historical reasoning",
    },
    {
      id: "world-1-6-q8",
      topicId: "world-1-6",
      concept: "europe-learning",
      prompt: "Which statement best describes early Renaissance humanism?",
      choices: [
        "It required all scholars to abandon Christianity.",
        "It eliminated differences in access to education.",
        "Renewed classical study and interest in human capacities could coexist with Christian belief.",
        "It began with European conquest of the Inca before 1200.",
      ],
      correctAnswer: 2,
      explanation:
        "Humanism altered intellectual emphasis without instantly replacing faith, institutions, or inequality.",
      difficulty: "Apply",
      skillTag: "Continuity and change",
    },
    {
      id: "world-1-6-k1",
      topicId: "world-1-6",
      concept: "europe-manors",
      prompt: "What commonly distinguished a serf from a free peasant?",
      choices: [
        "Guaranteed appointment as a royal official.",
        "Inherited obligations and restrictions tied to an estate.",
        "Exclusive rights to collect tribute from nobles.",
        "Membership in the clergy.",
      ],
      correctAnswer: 1,
      explanation:
        "Peasant statuses varied; serfdom involved specific constraints and obligations.",
      difficulty: "Quick check",
      skillTag: "Concept check",
    },
    {
      id: "world-1-6-k2",
      topicId: "world-1-6",
      concept: "europe-power",
      prompt: "What was a fief?",
      choices: [
        "Land or rights granted in return for obligations.",
        "An Islamic pilgrimage.",
        "A lake-based agricultural bed.",
        "A knotted record.",
      ],
      correctAnswer: 0,
      explanation: "Fiefs supported relationships between lords and vassals.",
      difficulty: "Quick check",
      skillTag: "Concept check",
    },
    {
      id: "world-1-6-k3",
      topicId: "world-1-6",
      concept: "europe-learning",
      prompt: "What does vernacular mean in literary history?",
      choices: [
        "A universal language of every religion.",
        "A special tax imposed on peasants.",
        "An agricultural rotation system.",
        "A locally used language.",
      ],
      correctAnswer: 3,
      explanation:
        "Vernacular writing used languages spoken by local communities rather than only a scholarly language such as Latin.",
      difficulty: "Quick check",
      skillTag: "Concept check",
    },
  ],
  quizzes: [
    {
      id: "world-1-6-quiz",
      courseId: "world",
      unitId: "world-1",
      topicId: "world-1-6",
      title: "Europe topic quiz",
      quizType: "topic",
      questionIds: [
        "world-1-6-q1",
        "world-1-6-q2",
        "world-1-6-q3",
        "world-1-6-q4",
        "world-1-6-q5",
        "world-1-6-q6",
        "world-1-6-q7",
        "world-1-6-q8",
      ],
    },
    {
      id: "world-1-6-quick",
      courseId: "world",
      unitId: "world-1",
      topicId: "world-1-6",
      title: "Europe quick practice",
      quizType: "quick",
      questionIds: ["world-1-6-k1", "world-1-6-k2", "world-1-6-k3"],
    },
  ],
};
