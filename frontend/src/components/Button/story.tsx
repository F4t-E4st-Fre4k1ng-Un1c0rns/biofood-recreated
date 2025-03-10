import type { Meta, StoryObj } from "@storybook/react";

import Button from "./index";

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    color: {
      options: ["primary", "secondary", "accent"],
      control: { type: "select" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const ButtonStory: Story = {
  args: {
    children: "Button",
    color: "primary",
  },
};
