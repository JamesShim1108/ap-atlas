// Copy into a course's unit/topics/<topic-name>/lesson.js.
// Replace the example content before publishing. Keep IDs stable after release.
export const lesson = {
  schemaVersion: 1,
  id: "course-1-topic",
  courseId: "course",
  unitId: "course-1",
  order: 1,
  code: "1.1",
  title: "Topic title",
  period: "Relevant period or course level",
  status: "ready",

  // Summary appears in lists; context introduces the actual reading.
  summary: "A short description for the topic list.",
  minutes: 5,
  learningGoals: ["Explain the main idea using a specific example."],
  bigIdea: "The central idea students should retain.",
  context: "The background needed to understand this topic.",
  sections: [
    {
      id: "core-idea",
      title: "The main explanation",
      conceptTitle: "Core idea", // Shorter label used in quiz results.
      lenses: [], // Optional IDs from this course's framework.js.
      blocks: [
        { type: "paragraph", text: "Write an original explanation here." },
        { type: "callout", title: "Remember", text: "A useful distinction." },
      ],
      takeaway: "The conclusion supported by this section.",
    },
  ],
  vocabulary: [],
  connections: [],
  sourceIds: ["course-source"], // Must exist in the course's sources.js.
};
