// Writing prompts and criteria are content. Saving and review behavior live in app/writing/.

export const writingQuizzes = [
  {
    id: "world-1-saq",
    version: 1,
    courseId: "world",
    unitId: "world-1",
    title: "Unit 1 writing quiz",
    prompt:
      "States across the world developed different ways to maintain authority in the period c. 1200 to c. 1450. Answer all three parts below.",
    instructions:
      "Write three APE responses, one for each part. Answer the question directly, Prove it with specific historical evidence, and Explain how that evidence supports your answer. Aim for a short paragraph per part, usually about three sentences. There is no required word count.",
    parts: [
      {
        id: "a",
        lenses: ["C", "P"],
        prompt:
          "Explain ONE way a belief system helped a ruler or government maintain authority in either Song China or Mali during the period c. 1200 to c. 1450.",
        criteria: [
          "Name a relevant way beliefs supported authority in Song China or Mali.",
          "Use an accurate, specific example within the period.",
          "Explain how that example strengthened authority, rather than only describing the belief.",
        ],
        model: {
          answer:
            "Confucian teaching helped the Song government justify political hierarchy.",
          prove:
            "Civil service examinations required candidates to study Confucian texts, which emphasized duties within ordered relationships.",
          explain:
            "Recruiting officials educated in those duties linked government service to a shared moral tradition and reinforced expectations of obedience to imperial authority.",
        },
        alternatives:
          "Mansa Musa’s patronage of Islamic learning or his 1324-1325 pilgrimage can also work if you explain how it enhanced his legitimacy or connections. Naming a religion without explaining the political link is insufficient.",
        review: [
          {
            topicId: "world-1-1",
            sectionId: "governance",
            label: "Song government",
          },
          {
            topicId: "world-1-5",
            sectionId: "africa-mali",
            label: "Mali",
          },
        ],
      },
      {
        id: "b",
        lenses: ["In", "E", "T", "P"],
        prompt:
          "Explain ONE way an agricultural adaptation or labor system supported a state in the Americas during the period c. 1200 to c. 1450.",
        criteria: [
          "Identify a relevant American state and an agricultural adaptation or labor system.",
          "Describe a specific example accurately.",
          "Explain how food production or mobilized labor supported the state.",
        ],
        model: {
          answer:
            "Intensive agriculture helped the Mexica support the population of their capital.",
          prove:
            "Farmers used chinampas, constructed growing beds in shallow lake areas, to produce crops near Tenochtitlan.",
          explain:
            "That food supply helped sustain urban residents and specialists, giving the state a stronger base for administration and expansion.",
        },
        alternatives:
          "Inca mit’a obligations or Andean terraces are acceptable when linked to resources for administration, infrastructure, or armies. Place early Inca expansion in the fifteenth century. Do not describe the later Spanish colonial mita as an Inca policy.",
        review: [
          {
            topicId: "world-1-4",
            sectionId: "americas-mexica",
            label: "Mexica agriculture",
          },
          {
            topicId: "world-1-4",
            sectionId: "americas-inca",
            label: "Inca labor",
          },
        ],
      },
      {
        id: "c",
        lenses: ["P", "S", "E"],
        prompt:
          "Explain ONE difference between how Song China and either the Mexica state or the Inca state administered their territories during the period c. 1200 to c. 1450.",
        criteria: [
          "Make an explicit difference about administration, comparing Song China with one named American state.",
          "Support both sides with accurate evidence.",
          "Explain what the difference meant for organizing officials, subjects, or resources.",
        ],
        model: {
          answer:
            "Song China emphasized examination-selected officials, while the Mexica often collected tribute through existing local rulers.",
          prove:
            "Song candidates studied Confucian writings for civil service examinations, whereas Mexica tributary communities commonly retained leaders who delivered required goods.",
          explain:
            "These arrangements gave Song rule a shared bureaucratic recruitment system, while Mexica control relied more on enforcing obligations through subordinate political communities.",
        },
        alternatives:
          "An Inca comparison can contrast Song examination recruitment with Inca officials and hereditary local leaders coordinating labor obligations. Both states had administration, so claiming that the Inca had no bureaucracy would not work. The states need not exist in the exact same year to be compared within the period.",
        review: [
          {
            topicId: "world-1-7",
            sectionId: "compare-governance",
            label: "Comparing administration",
          },
          {
            topicId: "world-1-4",
            sectionId: "americas-inca",
            label: "Inca administration",
          },
        ],
      },
    ],
    note: "This is an original classroom SAQ with three parts. APE is a writing scaffold, not a College Board scoring formula. The review offers one self-assessed point per part; it does not automatically grade your writing or predict an exam score.",
    headline: "Put it in your words.",
    promptTitle: "Building and maintaining authority",
    scaffold: [
      {
        label: "A / Answer",
        text: "Make a direct claim.",
      },
      {
        label: "P / Prove",
        text: "Use specific evidence.",
      },
      {
        label: "E / Explain",
        text: "Connect evidence to the claim.",
      },
    ],
    sidebar: {
      title: "A short paragraph is enough.",
      paragraphs: [
        "Use a concrete example, then explain what it shows. Part C needs evidence for both societies.",
        "You do not need an introduction or conclusion for the whole question.",
      ],
    },
  },
];
