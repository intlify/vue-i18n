import type { Meta, StoryObj } from '@storybook/vue3'

import MyLocalizedPage from './LocalizedPage.vue'

const meta = {
  title: 'Localized/Page',
  component: MyLocalizedPage,
  render: () => ({
    components: { MyLocalizedPage },
    template: '<my-localized-page />',
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof MyLocalizedPage>

export default meta
type Story = StoryObj<typeof meta>

// More on component testing: https://storybook.js.org/docs/writing-tests/component-testing

export const LocalizedPage: Story = {}
