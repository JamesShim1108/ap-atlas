// Questions live once. Quizzes choose their IDs instead of copying the records.
export const bank = {
  questions: [
    {
      id: "course-topic-check-1",
      topicId: "course-1-topic",
      concept: "core-idea", // Matches the section ID in lesson.js.
      difficulty: "Core",
      skillTag: "Explanation",
      prompt: "Replace this with a clear question about the lesson.",
      choices: [
        "Correct answer",
        "Plausible alternative",
        "Another alternative",
        "Last alternative",
      ],
      correctAnswer: 0, // Array positions start at zero.
      explanation:
        "Explain why the answer follows from the evidence, and address misconceptions.",
    },
  ],
  quizzes: [
    {
      id: "course-1-topic-quick",
      courseId: "course",
      unitId: "course-1",
      topicId: "course-1-topic",
      title: "Quick check",
      quizType: "quick",
      questionIds: ["course-topic-check-1"],
    },
    {
      id: "course-1-topic-quiz",
      courseId: "course",
      unitId: "course-1",
      topicId: "course-1-topic",
      title: "Topic practice",
      quizType: "topic",
      questionIds: ["course-topic-check-1"],
    },
  ],
};
