// Original practice questions. correctAnswer is a zero-based choice index; never renumber existing IDs.

export const bank = {
  questions: [
    {
      id: "islam-q1",
      concept: "islam-states",
      difficulty: "Core",
      skillTag: "Continuity and change",
      prompt: "Which statement best describes Dar al-Islam around 1200–1450?",
      choices: [
        "One caliph directly governed every Muslim community.",
        "Muslim political authority divided among states while religious and cultural links persisted.",
        "The fall of one dynasty ended Islam throughout Afro-Eurasia.",
        "Regional rulers abandoned all earlier Islamic institutions.",
      ],
      correctAnswer: 1,
      explanation:
        "New states held political power, yet religious practices, legal traditions, commerce, and learning connected communities across their borders. Dar al-Islam was not a single empire.",
      topicId: "world-1-2",
    },
    {
      id: "islam-q2",
      concept: "islam-states",
      difficulty: "Apply",
      skillTag: "Using evidence",
      stimulus:
        "A military ruler commands an army and controls taxation while recognizing the religious prestige of a caliph in Baghdad.",
      prompt: "Which development does this situation best illustrate?",
      choices: [
        "The disappearance of Muslim rule from the Middle East",
        "Government by elected merchant assemblies",
        "An equal sharing of authority among every religious community",
        "A distinction between a sultan’s political power and a caliph’s religious prestige",
      ],
      correctAnswer: 3,
      explanation:
        "Seljuk rulers illustrate how sultans could hold practical military and political authority while Abbasid caliphs retained religious status. This is a change in the organization of power, not the end of Muslim government.",
      topicId: "world-1-2",
    },
    {
      id: "islam-q3",
      concept: "islam-beliefs",
      difficulty: "Core",
      skillTag: "Explaining significance",
      prompt: "How could the pilgrimage to Mecca help connect Muslim societies?",
      choices: [
        "It brought believers from different regions into contact through a shared religious practice.",
        "It required all participating states to merge their governments.",
        "It removed all differences in language and local custom.",
        "It replaced commercial travel between cities.",
      ],
      correctAnswer: 0,
      explanation:
        "Pilgrimage joined a shared religious obligation with travel and encounters across regions. Shared practice did not erase cultural differences or create a unified government.",
      topicId: "world-1-2",
    },
    {
      id: "islam-q4",
      concept: "islam-beliefs",
      difficulty: "Apply",
      skillTag: "Evidence and limits",
      stimulus:
        "Records from a Muslim-ruled city show Jewish and Christian communities maintaining worship and participating in trade, while facing special taxes and legal restrictions.",
      prompt: "Which conclusion accounts for all the evidence?",
      choices: [
        "Religious communities had identical legal rights.",
        "Religious diversity made economic cooperation impossible.",
        "Religious coexistence could operate alongside unequal legal status.",
        "Every resident had converted to Islam.",
      ],
      correctAnswer: 2,
      explanation:
        "The evidence includes both continuing communal life and restrictions. It supports neither full equality nor the claim that all coexistence was impossible. Conditions varied by place and ruler.",
      topicId: "world-1-2",
    },
    {
      id: "islam-q5",
      concept: "islam-spread",
      difficulty: "Apply",
      skillTag: "Causation",
      stimulus:
        "A port community gradually adopts Islamic practices through contact with visiting merchants and a local Sufi teacher. No new army has taken control of the port.",
      prompt: "Which process best explains this change?",
      choices: [
        "Political unification under the Abbasids",
        "Religious diffusion through commerce and teaching",
        "A compulsory conversion ordered by conquering soldiers",
        "The end of long-distance exchange",
      ],
      correctAnswer: 1,
      explanation:
        "The scenario gives evidence of trade and religious teaching, not military conquest. These contacts could support conversion even without a new Muslim government.",
      topicId: "world-1-2",
    },
    {
      id: "islam-q6",
      concept: "islam-spread",
      difficulty: "Apply",
      skillTag: "Historical reasoning",
      prompt:
        "Why should a historian distinguish the expansion of Muslim rule from the spread of Islam?",
      choices: [
        "Muslim merchants never traveled outside Muslim-ruled states.",
        "Political conquest always produced immediate religious uniformity.",
        "Sufi teachers primarily collected imperial taxes.",
        "A Muslim government could rule non-Muslims, and Islam could spread beyond its political borders.",
      ],
      correctAnswer: 3,
      explanation:
        "Political control and personal or communal religious change are different processes. The Delhi Sultanate ruled many non-Muslim subjects, while trading and teaching networks could carry Islam beyond state boundaries.",
      topicId: "world-1-2",
    },
    {
      id: "islam-q7",
      concept: "islam-learning",
      difficulty: "Core",
      skillTag: "Explaining a development",
      prompt:
        "Which example most clearly illustrates intellectual innovation in the Islamic world?",
      choices: [
        "Al-Tusi developing mathematical and astronomical work at an observatory",
        "An army collecting taxes after occupying a city",
        "A ruler replacing one governor with another",
        "A caravan carrying an unchanged manuscript to a new town",
      ],
      correctAnswer: 0,
      explanation:
        "Al-Tusi’s mathematical and astronomical work added to knowledge. Carrying a manuscript is intellectual transfer; innovation specifically involves developing new methods, explanations, or findings.",
      topicId: "world-1-2",
    },
    {
      id: "islam-q8",
      concept: "islam-learning",
      difficulty: "Apply",
      skillTag: "Using evidence",
      stimulus:
        "A student claims that the Mongol capture of Baghdad in 1258 ended intellectual activity everywhere in the Islamic world.",
      prompt: "Which evidence most directly challenges the claim?",
      choices: [
        "Abbasid caliphs had supported scholars before 1200.",
        "Baghdad was an important city before its conquest.",
        "Al-Tusi conducted astronomical work under Mongol patronage, and Ibn Khaldun wrote in a later century.",
        "Some Muslim rulers had Turkic backgrounds.",
      ],
      correctAnswer: 2,
      explanation:
        "The claim concerns all intellectual activity after 1258. Evidence of later scholarship directly contradicts it. Evidence only from before the conquest would not establish what happened afterward.",
      topicId: "world-1-2",
    },
    {
      id: "islam-q9",
      concept: "islam-exchange",
      difficulty: "Apply",
      skillTag: "Explaining a process",
      prompt:
        "Which sequence best explains one route of intellectual exchange through Iberia?",
      choices: [
        "Latin translation → the end of all Arabic scholarship → universal literacy",
        "Military conquest → identical beliefs → no need for translation",
        "Political division → total isolation → disappearance of written knowledge",
        "Arabic texts and commentaries → translation into Latin → wider use by European scholars",
      ],
      correctAnswer: 3,
      explanation:
        "Translation allowed additional readers to study earlier works and Arabic commentaries. It expanded access and debate; it did not require religious uniformity or end scholarship in the source language.",
      topicId: "world-1-2",
    },
    {
      id: "islam-q10",
      concept: "islam-exchange",
      difficulty: "Apply",
      skillTag: "Comparison",
      prompt:
        "What useful comparison links Islamic intellectual exchange with Chinese cultural influence in Korea and Japan?",
      choices: [
        "Both involved receiving societies adopting and adapting ideas across political boundaries.",
        "Both required every receiving society to become a province of one empire.",
        "Both prevented local traditions from shaping borrowed ideas.",
        "Both spread ideas only through military conquest.",
      ],
      correctAnswer: 0,
      explanation:
        "In both cases, cultural influence crossed political borders and involved local choices. Contact and adaptation help explain the similarities without assuming one government controlled every society.",
      topicId: "world-1-2",
    },
    {
      id: "islam-k1",
      concept: "islam-states",
      difficulty: "Quick check",
      skillTag: "Concept check",
      prompt: "Which state emerged when a military elite took power in Egypt in 1250?",
      choices: [
        "Song dynasty",
        "Mamluk Sultanate",
        "Delhi Sultanate",
        "Abbasid Caliphate",
      ],
      correctAnswer: 1,
      explanation:
        "Mamluk leaders established their sultanate in Egypt in 1250. Delhi was a separate center of Muslim rule in northern India; the Song governed in China.",
      topicId: "world-1-2",
    },
    {
      id: "islam-k2",
      concept: "islam-spread",
      difficulty: "Quick check",
      skillTag: "Concept check",
      prompt: "What role did Sufi teachers play in the spread of Islam?",
      choices: [
        "They required all communities to abandon local languages.",
        "They ended religious teaching outside Baghdad.",
        "They introduced religious ideas through spiritual instruction and community relationships.",
        "They united every Muslim state under a single sultan.",
      ],
      correctAnswer: 2,
      explanation:
        "Sufi teachers helped communicate Islam through spiritual practice and personal relationships. Their methods varied, and their influence did not depend on one unified state.",
      topicId: "world-1-2",
    },
    {
      id: "islam-k3",
      concept: "islam-exchange",
      difficulty: "Quick check",
      skillTag: "Explaining significance",
      prompt: "Why did translating scholarly works into new languages matter?",
      choices: [
        "It removed the need for anyone to study earlier ideas.",
        "It proved all societies held identical beliefs.",
        "It ensured every translated idea remained unchanged forever.",
        "It allowed new groups of readers to study, debate, and develop the ideas.",
      ],
      correctAnswer: 3,
      explanation:
        "Translation widened access to knowledge. Readers could interpret or build on ideas, so intellectual transfer could also support further innovation.",
      topicId: "world-1-2",
    },
  ],
  quizzes: [
    {
      id: "world-1-2-quiz",
      courseId: "world",
      unitId: "world-1",
      topicId: "world-1-2",
      title: "Dar al-Islam topic quiz",
      quizType: "topic",
      questionIds: [
        "islam-q1",
        "islam-q2",
        "islam-q3",
        "islam-q4",
        "islam-q5",
        "islam-q6",
        "islam-q7",
        "islam-q8",
        "islam-q9",
        "islam-q10",
      ],
    },
    {
      id: "world-1-2-quick",
      courseId: "world",
      unitId: "world-1",
      topicId: "world-1-2",
      title: "Dar al-Islam quick practice",
      quizType: "quick",
      questionIds: ["islam-k1", "islam-k2", "islam-k3"],
    },
  ],
};
