import type { Meta, StoryObj } from "@storybook/react";

import Error from "./index";

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Error> = {
  component: Error,
  argTypes: {
    code: {
      options: [403, 404, 500],
      control: { type: "select" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Error>;

export const ErrorStory: Story = {
  args: {
    code: 500,
  },
};
