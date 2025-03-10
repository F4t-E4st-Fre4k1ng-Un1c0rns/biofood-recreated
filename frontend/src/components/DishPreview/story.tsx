import type { Meta, StoryObj } from "@storybook/react";

import DishPreview from "./index";

const meta: Meta<typeof DishPreview> = {
  component: DishPreview,
};

export default meta;
type Story = StoryObj<typeof DishPreview>;

export const DishPreviewStory: Story = {
  args: {
    dish: {
      id: "hi!",
      name: "Еда",
      banner:
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1024",
      price: 1000,
      description: "Очень вкусная еда",
      category: "Food",
      weight: 1000,
    },
    count: 0,
  },
};

export const DishPreviewWithoutBanner: Story = {
  args: {
    dish: {
      id: "hi!",
      name: "Еда",
      banner: undefined,
      price: 1000,
      description: "Очень вкусная еда",
      category: "Food",
      weight: 1000,
    },
    count: 0,
  },
};

export const Long: Story = {
  args: {
    dish: {
      id: "hi!",
      name: "Едаааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа вкуууууснаяяя",
      banner:
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1024",
      price: 100000000000,
      description:
        "Очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень вкусная еда",
      category: "Food",
      weight: 10000000000,
    },
    count: 100000000000000000000000,
  },
};
