// Original practice questions. correctAnswer is a zero-based choice index; never renumber existing IDs.

export const bank = {
  questions: [
    {
      id: "world-1-7-q1",
      topicId: "world-1-7",
      concept: "compare-governance",
      prompt:
        "Which statement makes the strongest comparison of political administration?",
      choices: [
        "China had rice, while Europe had cathedrals.",
        "Song rulers used examination-selected officials, while Mexica rulers often enforced tribute through local leaders.",
        "All states were identical because they had people.",
        "The Inca were located far away from Mali.",
      ],
      correctAnswer: 1,
      explanation:
        "The correct statement compares the same dimension and offers evidence for both sides.",
      difficulty: "Apply",
      skillTag: "Comparison",
    },
    {
      id: "world-1-7-q2",
      topicId: "world-1-7",
      concept: "compare-beliefs",
      prompt: "What is a defensible similarity between Mali and Ethiopia?",
      choices: [
        "Rulers could draw legitimacy from religious patronage despite supporting different traditions.",
        "Both followed one uniform state religion across Africa.",
        "Both were directly governed from Baghdad.",
        "Neither used resources for religious construction.",
      ],
      correctAnswer: 0,
      explanation:
        "The comparison identifies a common function while preserving differences between Islamic and Christian traditions.",
      difficulty: "Apply",
      skillTag: "Comparison",
    },
    {
      id: "world-1-7-q3",
      topicId: "world-1-7",
      concept: "compare-resources",
      prompt:
        "Which evidence best supports a claim that states obtained resources in different forms?",
      choices: [
        "Both societies had people who needed food.",
        "Both societies existed somewhere in the Americas.",
        "Every state used identical coins and tax rates.",
        "Mexica tribute included goods, while Inca mit’a organized labor service.",
      ],
      correctAnswer: 3,
      explanation:
        "The examples distinguish forms of extraction and show how they supplied state needs.",
      difficulty: "Apply",
      skillTag: "Using evidence",
    },
    {
      id: "world-1-7-q4",
      topicId: "world-1-7",
      concept: "compare-change",
      prompt: "Which example illustrates continuity with innovation?",
      choices: [
        "Every institution ended when a ruler died.",
        "All cities kept exactly the same government for centuries.",
        "Chinese dynasties retained bureaucracy while changing recruitment and administration.",
        "Beliefs never influenced political change.",
      ],
      correctAnswer: 2,
      explanation:
        "Continuity means an institution persists; innovation means its operation can change. Both can occur together.",
      difficulty: "Apply",
      skillTag: "Continuity and change",
    },
    {
      id: "world-1-7-q5",
      topicId: "world-1-7",
      concept: "compare-evidence",
      prompt:
        "Which sentence provides the explanation in an APE response about rice and cities?",
      choices: [
        "Champa rice was a crop.",
        "A greater food supply could sustain more people working outside farming, supporting urban specialization.",
        "Cities existed during the Song dynasty.",
        "China was located in East Asia.",
      ],
      correctAnswer: 1,
      explanation:
        "The explanation connects the evidence to a mechanism and an outcome. Merely naming facts does not make that link.",
      difficulty: "Apply",
      skillTag: "Argumentation",
    },
    {
      id: "world-1-7-q6",
      topicId: "world-1-7",
      concept: "compare-governance",
      prompt:
        "Which evidence most directly challenges the claim that all states centralized between 1200 and 1450?",
      choices: [
        "Maya and Hausa cities continued to have separate rulers.",
        "Mali and the Inca expanded their territory.",
        "Several rulers patronized religious institutions.",
        "Farmers in many regions cultivated crops.",
      ],
      correctAnswer: 0,
      explanation:
        "Persistent independent political centers qualify the sweeping claim. Expansion in one state does not prove a universal trend.",
      difficulty: "Apply",
      skillTag: "Evaluating a claim",
    },
    {
      id: "world-1-7-q7",
      topicId: "world-1-7",
      concept: "compare-change",
      prompt: "What chronology caution matters when comparing the Song and Inca states?",
      choices: [
        "Both states reached their greatest size in exactly 1200.",
        "Neither state existed at any point in the unit.",
        "Inca expansion caused the Song collapse in 1279.",
        "The Song ended in 1279, while major Inca expansion began near the unit’s fifteenth-century endpoint.",
      ],
      correctAnswer: 3,
      explanation:
        "A broad period permits comparison without implying contemporaneous peaks or an unsupported causal link.",
      difficulty: "Apply",
      skillTag: "Contextualization",
    },
    {
      id: "world-1-7-q8",
      topicId: "world-1-7",
      concept: "compare-evidence",
      prompt:
        "A historian uses a royal temple to claim every subject supported the ruler. What is the main weakness?",
      choices: [
        "Buildings can never supply historical evidence.",
        "All religious buildings were built without labor.",
        "Elite patronage does not by itself reveal the beliefs or loyalty of every subject.",
        "Only modern surveys count as historical evidence.",
      ],
      correctAnswer: 2,
      explanation:
        "The building can show patronage and resources, but the universal claim exceeds what that evidence establishes.",
      difficulty: "Apply",
      skillTag: "Evidence and limits",
    },
    {
      id: "world-1-7-k1",
      topicId: "world-1-7",
      concept: "compare-evidence",
      prompt: "What must a comparison address?",
      choices: [
        "Two unrelated facts without a connection.",
        "A shared category in two or more cases.",
        "Only the spelling of rulers’ names.",
        "A future event outside the stated period.",
      ],
      correctAnswer: 1,
      explanation: "Use a common category such as administration, belief, or labor.",
      difficulty: "Quick check",
      skillTag: "Concept check",
    },
    {
      id: "world-1-7-k2",
      topicId: "world-1-7",
      concept: "compare-beliefs",
      prompt: "What does legitimacy describe?",
      choices: [
        "A perceived justification for authority.",
        "The exact size of every state’s army.",
        "The number of crops planted in one field.",
        "A requirement that all subjects share one language.",
      ],
      correctAnswer: 0,
      explanation:
        "Beliefs, institutions, ancestry, and other claims could justify authority.",
      difficulty: "Quick check",
      skillTag: "Concept check",
    },
    {
      id: "world-1-7-k3",
      topicId: "world-1-7",
      concept: "compare-resources",
      prompt:
        "Which InSPECT lens most directly fits required payments and labor obligations?",
      choices: [
        "C: Cultural developments alone.",
        "T: Technology alone.",
        "In: Physical geography alone.",
        "E: Economic systems.",
      ],
      correctAnswer: 3,
      explanation:
        "These are ways resources and work are organized. They can also connect to political and social lenses.",
      difficulty: "Quick check",
      skillTag: "Concept check",
    },
  ],
  quizzes: [
    {
      id: "world-1-7-quiz",
      courseId: "world",
      unitId: "world-1",
      topicId: "world-1-7",
      title: "Comparisons in the Period topic quiz",
      quizType: "topic",
      questionIds: [
        "world-1-7-q1",
        "world-1-7-q2",
        "world-1-7-q3",
        "world-1-7-q4",
        "world-1-7-q5",
        "world-1-7-q6",
        "world-1-7-q7",
        "world-1-7-q8",
      ],
    },
    {
      id: "world-1-7-quick",
      courseId: "world",
      unitId: "world-1",
      topicId: "world-1-7",
      title: "Comparisons in the Period quick practice",
      quizType: "quick",
      questionIds: ["world-1-7-k1", "world-1-7-k2", "world-1-7-k3"],
    },
  ],
};
