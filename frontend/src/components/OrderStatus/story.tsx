import type { Meta, StoryObj } from "@storybook/react";

import OrderStatusComponent from "./index";
import OrderStatus from "@/types/OrderStatus";

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof OrderStatusComponent> = {
  component: OrderStatusComponent,
  argTypes: {
    status: {
      options: [
        OrderStatus.accepted,
        OrderStatus.canceled,
        OrderStatus.cooking,
        OrderStatus.pending,
        OrderStatus.ready,
        OrderStatus.taken,
      ],
      control: {
        type: "select",

        labels: {
          [OrderStatus.accepted]: "accepted",
          [OrderStatus.canceled]: "canceled",
          [OrderStatus.cooking]: "cooking",
          [OrderStatus.pending]: "pending",
          [OrderStatus.ready]: "ready",
          [OrderStatus.taken]: "taken",
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OrderStatusComponent>;

export const Status: Story = {
  args: {
    status: OrderStatus.pending,
  },
};
