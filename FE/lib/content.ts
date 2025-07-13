import { type JSONContent } from "novel";

export const defaultEditorContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [
        {
          type: "text",
          text: "Slack-LMS를 소개합니다",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "이곳에 자유롭게 문서를 작성하고 팀원들과 공유해보세요.",
        },
      ],
    },
  ],
};
