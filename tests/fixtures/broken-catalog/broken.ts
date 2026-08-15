import type { Department } from "../../../src/data/types";

export const broken = {
  name: "Broken Department",
  description: "Fixture data — every check in validate-data.mjs should fire.",
  link: "/broken",
  years: [
    {
      year: 9,
      semesters: [
        {
          number: 12340,
          subjects: [
            {
              name: "Nonsense",
              subject_code: "XX000",
              notes: [
                {
                  title: "Wrong type",
                  type: "notes",
                  link: "https://example.com/a",
                },
                {
                  title: "",
                  type: "theory",
                  link: "https://example.com/b",
                },
                {
                  title: "Missing scheme",
                  type: "theory",
                  link: "drive.google.com/drive/folders/x",
                },
                {
                  title: "Drive home page",
                  type: "theory",
                  link: "https://drive.google.com/",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} as unknown as Department;
