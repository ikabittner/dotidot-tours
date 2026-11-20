// Homepage tour v2: Mára's review of 20. 11. 2026 on top of tours/homepage (which stays frozen).
// Feed setup is simpler (scene connect_v2), Analytics walks the report before AI Insights.
// Campaign setup replaces Revive zombies once its screens are checked in the demo account.
// Inlined into shell/shell.html by tools/build.py. Helpers q, root, frameAround come from the shell.
const varBtn = q('#vi [data-icon-button]');
const PATHS = {
  feed: {
    label: 'Feed setup',
    intro: { title: 'Set up your product data', body: 'Bring your feed into Dotidot, add data from Google Ads, Google Analytics 4 and Meta, and fix every product title with one rule.' },
    end: { title: 'Your product data is ready', body: 'Products, performance data and better titles in one place, updated with every feed sync.' },
    groups: [
      { title: 'Add a data source', body: 'Everything in Dotidot starts with your product data. Add your feed as a new data source.', hints: ['Click the + button'], eye: '?' },
      { title: 'Pick the feed type', body: 'Dotidot reads CSV, XML and JSON feeds, Google Sheets, your website or Google Analytics 4. This store has a CSV feed.', hints: ['Click Data feed file'], eye: '•' },
      { title: 'Paste your feed URL', body: 'Name the data source and paste the URL of your feed file.', hints: ['Click the Name field', 'Click the URL field', 'Click Add data source'], eye: '*' },
      { title: 'All 509 products in', body: 'Dotidot imports the feed and keeps it updated on schedule. Every product is ready to work with.', eye: '!' },
      { title: 'Add performance data', body: 'Connect Google Ads, Google Analytics 4 and Meta. Clicks, costs, views and purchases land on every product.', hints: ['Connect Google Ads', 'Connect Google Analytics 4', 'Connect Meta'], eye: '+' },
      { title: 'Write the rule once', body: 'Variables change thousands of products at once. Start a new one for better titles.', hints: ['Click the Name field'], eye: '#' },
      { title: 'Combine two fields', body: 'Put the product type in front of the product name.', hints: ['Click the variable button', 'Pick product_type', 'Click the variable button', 'Pick name'], eye: '^' },
      { title: 'Every title follows', body: 'The preview updates right away. The Canon kit now starts with Digital Camera.', eye: '$' },
      { title: 'Save the variable', body: 'It applies to all 509 products and updates with every feed sync.', hints: ['Click Save custom variable'], eye: '•' },
    ],
    steps: [
      { g: 0, h: 0, sc: 'connect', tc: 0.38, el: q('#plus-btn'), act: 'click' },
      { g: 1, h: 0, sc: 'connect', tc: 1.47, el: q('#tile-feed'), near: q('#mgrid'), act: 'click' },
      { g: 2, h: 0, sc: 'connect', tc: 1.96, el: root('#feed-name'), act: 'click' },
      { g: 2, h: 1, sc: 'connect', tc: 2.88, el: root('#feed-url'), act: 'click' },
      { g: 2, h: 2, sc: 'connect', tc: 4.38, cam: frameAround('#f-url', '#add-ds'), el: q('#add-ds'), act: 'click' },
      { g: 3, sc: 'connect', tc: 6.3, el: q('#imp-card'), act: 'read' },
      { g: 4, h: 0, sc: 'connect', tc: 6.98, el: q('#en-0 .en-btn'), near: q('#en-panel'), act: 'click' },
      { g: 4, h: 1, sc: 'connect', tc: 7.43, el: q('#en-1 .en-btn'), near: q('#en-panel'), act: 'click' },
      { g: 4, h: 2, sc: 'connect', tc: 7.88, el: q('#en-2 .en-btn'), near: q('#en-panel'), act: 'click', exit: 8.7 },
      { g: 5, h: 0, sc: 'vars', tc: 0.25, cam: 0.0, establish: true, el: root('#var-name'), act: 'click' },
      { g: 6, h: 0, sc: 'vars', tc: 1.62, el: varBtn, act: 'click' },
      { g: 6, h: 1, sc: 'vars', tc: 1.62, el: q('#dd-v-type'), act: 'click', dd: { id: 'ddVarPick', at: varBtn, align: 'right' } },
      { g: 6, h: 2, sc: 'vars', tc: 2.92, el: varBtn, act: 'click' },
      { g: 6, h: 3, sc: 'vars', tc: 2.92, el: q('#dd-v-name'), act: 'click', dd: { id: 'ddVarPick', at: varBtn, align: 'right' } },
      { g: 7, sc: 'vars', tc: 5.0, el: q('#pv-102448'), act: 'read' },
      { g: 8, h: 0, sc: 'vars', tc: 6.35, cam: 6.5, el: q('#save-var'), act: 'click', exit: 7.6 },
    ],
  },
  ai: {
    label: 'Analytics & MCP',
    intro: { title: 'See what your products earn', body: 'Product Analytics shows how every product performs. AI Insights explains what changed, and your AI assistant can act on it.' },
    end: { title: 'Answers and actions in one place', body: 'See what changed, ask in plain words and confirm the next step yourself.' },
    groups: [
      { title: 'Lists ready for you', body: 'Dotidot sorts all 509 products into tabs: 18 losers, 42 underperformers, 9 budget spenders and 312 inactive products.', eye: '?' },
      { title: 'Spend and ROAS every day', body: 'Daily spend against ROAS for the whole catalog. Over 30 days the average ROAS is 597%.', eye: '$' },
      { title: 'Where the money goes', body: '€3,120 went to products that lose money and €6,840 to low ROAS ones. Each card opens the list behind it.', eye: '!' },
      { title: 'Ask AI Insights', body: 'AI Insights reads the same numbers and tells you what changed.', hints: ['Click AI Insights'], eye: '#' },
      { title: 'Revived zombies are selling', body: '38 products got their first sales this month, +€9,870 in revenue. The Canon kit went from zero clicks to 742% ROAS.', eye: '+' },
      { title: 'Prefer to ask?', body: 'Use Claude or ChatGPT with your Dotidot data. Ask about your products in plain words.', hints: ['Click the message box', 'Send the question'], eye: '•' },
      { title: 'Answers from your data', body: 'The assistant checks Product Analytics and your campaigns, then answers with real products and numbers.', eye: '^' },
      { title: 'Nothing goes live until you confirm', body: 'The assistant suggests a bigger budget for PMax - Zombies. Dotidot applies it only after you confirm.', hints: ['Click Confirm'], eye: '*' },
    ],
    steps: [
      { g: 0, sc: 'pa', tc: 2.0, cam: { x: 284, y: 64, w: 1316 }, el: q('[role=tablist]'), act: 'read' },
      { g: 1, sc: 'pa', tc: 2.0, cam: { x: 290, y: 236, w: 1300 }, el: q('.chart-card'), act: 'read' },
      { g: 2, sc: 'pa', tc: 2.0, cam: { x: 290, y: 900, w: 1300 }, el: q('.pi-row'), act: 'read' },
      { g: 3, h: 0, sc: 'pa', tc: 2.4, el: q('#ai-btn'), act: 'click' },
      { g: 4, sc: 'pa', tc: 6.75, el: q('#card-opportunity'), act: 'read', exit: 7.4 },
      { g: 5, h: 0, sc: 'mcp', tc: 1.0, el: q('#composer'), near: q('#card'), act: 'click' },
      { g: 5, h: 1, sc: 'mcp', tc: 3.62, el: q('#cSend'), near: q('#card'), act: 'click' },
      { g: 6, sc: 'mcp', tc: 6.7, el: q('#stRows'), near: q('#card'), act: 'read' },
      { g: 7, h: 0, sc: 'mcp', tc: 8.12, el: q('#btnConfirm'), near: q('#card'), act: 'click', exit: 9.9 },
    ],
  },
};
const ORDER = ['feed', 'ai'];
const ICONS = {
  feed: `<svg class="pic" width="32" height="32" aria-hidden="true" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M32.084 23.6387C31.4397 24.0401 30.6926 24.3965 29.8672 24.7061C27.1891 25.7103 23.6402 26.25 20 26.25C16.36 26.25 12.8118 25.7102 10.1338 24.7061C9.30863 24.3966 8.56112 24.0409 7.91699 23.6396V30C7.91699 30.1891 8.0134 30.5271 8.52051 30.9863C9.02748 31.4453 9.84754 31.929 11.0107 32.3652C13.3335 33.2363 16.568 33.75 20 33.75C23.432 33.75 26.6664 33.2362 28.9893 32.3652C30.1526 31.929 30.9725 31.4453 31.4795 30.9863C31.9869 30.5269 32.084 30.1891 32.084 30V23.6387ZM32.084 13.6387C31.4397 14.0401 30.6926 14.3965 29.8672 14.7061C27.1891 15.7103 23.6402 16.25 20 16.25C16.36 16.25 12.8118 15.7102 10.1338 14.7061C9.30863 14.3966 8.56112 14.0409 7.91699 13.6396V20C7.91699 20.1891 8.0134 20.5271 8.52051 20.9863C9.02748 21.4453 9.84754 21.929 11.0107 22.3652C13.3335 23.2363 16.568 23.75 20 23.75C23.432 23.75 26.6664 23.2362 28.9893 22.3652C30.1526 21.929 30.9725 21.4453 31.4795 20.9863C31.9869 20.5269 32.084 20.1891 32.084 20V13.6387ZM32.084 10C32.084 9.81088 31.9869 9.47307 31.4795 9.01367C30.9725 8.55466 30.1526 8.07103 28.9893 7.63477C26.6664 6.76376 23.432 6.25 20 6.25C16.568 6.25003 13.3335 6.76373 11.0107 7.63477C9.84754 8.071 9.02748 8.5547 8.52051 9.01367C8.0134 9.4729 7.91699 9.81092 7.91699 10C7.91699 10.1891 8.0134 10.5271 8.52051 10.9863C9.02748 11.4453 9.84754 11.929 11.0107 12.3652C13.3335 13.2363 16.568 13.75 20 13.75C23.432 13.75 26.6664 13.2362 28.9893 12.3652C30.1526 11.929 30.9725 11.4453 31.4795 10.9863C31.9869 10.5269 32.084 10.1891 32.084 10ZM34.584 30C34.584 31.137 33.9773 32.0974 33.1572 32.8398C32.3368 33.5826 31.2042 34.2047 29.8672 34.7061C27.1891 35.7103 23.6402 36.25 20 36.25C16.36 36.25 12.8118 35.7102 10.1338 34.7061C8.79667 34.2046 7.66326 33.5827 6.84277 32.8398C6.02286 32.0975 5.41699 31.1368 5.41699 30V10C5.41699 8.86316 6.02286 7.90253 6.84277 7.16016C7.66326 6.41735 8.79667 5.79537 10.1338 5.29395C12.8118 4.28978 16.36 3.75003 20 3.75C23.6402 3.75 27.1891 4.28968 29.8672 5.29395C31.2042 5.79534 32.3368 6.41739 33.1572 7.16016C33.9773 7.90256 34.584 8.86304 34.584 10V30Z" fill="url(#paint0_linear_4423_2339)" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" stroke="url(#paint1_linear_4423_2339)"/> <defs> <linearGradient id="paint0_linear_4423_2339" x1="20.0005" y1="3.75" x2="20.0005" y2="36.25" gradientUnits="userSpaceOnUse"> <stop stop-color="#BD99C9"/> <stop offset="1" stop-color="#5A0078"/> </linearGradient> <linearGradient id="paint1_linear_4423_2339" x1="20.0005" y1="3.75" x2="20.0005" y2="36.25" gradientUnits="userSpaceOnUse"> <stop stop-color="#DECCE4"/> <stop offset="1" stop-color="#480060"/> </linearGradient> </defs> </svg>`,
  ai: `<svg class="pic" width="32" height="32" aria-hidden="true" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M13.75 30C13.75 29.0054 13.3546 28.0519 12.6514 27.3486C11.9481 26.6454 10.9946 26.25 10 26.25C9.00544 26.25 8.05189 26.6454 7.34863 27.3486C6.64537 28.0519 6.25 29.0054 6.25 30C6.25 30.9946 6.64537 31.9481 7.34863 32.6514C8.05189 33.3546 9.00544 33.75 10 33.75C10.9946 33.75 11.9481 33.3546 12.6514 32.6514C13.3546 31.9481 13.75 30.9946 13.75 30ZM28.75 25C28.75 24.4475 28.5302 23.918 28.1396 23.5273C27.749 23.1367 27.2194 22.9171 26.667 22.917C26.1145 22.917 25.5841 23.1366 25.1934 23.5273C24.8029 23.918 24.583 24.4476 24.583 25C24.583 25.5524 24.8029 26.082 25.1934 26.4727C25.5841 26.8634 26.1145 27.083 26.667 27.083C27.2194 27.0829 27.749 26.8633 28.1396 26.4727C28.5302 26.082 28.75 25.5525 28.75 25ZM33.75 10C33.75 9.00544 33.3546 8.05189 32.6514 7.34863C31.9481 6.64537 30.9946 6.25 30 6.25C29.0054 6.25 28.0519 6.64537 27.3486 7.34863C26.6454 8.05189 26.25 9.00544 26.25 10C26.25 10.9946 26.6454 11.9481 27.3486 12.6514C28.0519 13.3546 29.0054 13.75 30 13.75C30.9946 13.75 31.9481 13.3546 32.6514 12.6514C33.3546 11.9481 33.75 10.9946 33.75 10ZM6.25 11.667C6.25009 12.2194 6.46973 12.749 6.86035 13.1396C7.25098 13.5303 7.78059 13.7499 8.33301 13.75C8.88554 13.75 9.41594 13.5303 9.80664 13.1396C10.1972 12.749 10.4169 12.2193 10.417 11.667C10.417 11.1145 10.1973 10.5841 9.80664 10.1934C9.41594 9.80266 8.88554 9.58301 8.33301 9.58301C7.78067 9.58309 7.25096 9.80284 6.86035 10.1934C6.46965 10.5841 6.25 11.1145 6.25 11.667ZM36.25 10C36.25 11.6576 35.591 13.2468 34.4189 14.4189C33.2468 15.591 31.6576 16.25 30 16.25C28.3424 16.25 26.7532 15.591 25.5811 14.4189C24.7438 13.5817 24.1695 12.5315 23.9092 11.3955L12.7773 12.7871C12.6941 13.1173 12.5727 13.4361 12.4189 13.7393L23.707 21.501C24.5313 20.8037 25.5792 20.417 26.667 20.417C27.8823 20.4171 29.0478 20.8995 29.9072 21.7588C30.7668 22.6183 31.25 23.7844 31.25 25C31.25 26.2156 30.7668 27.3817 29.9072 28.2412C29.0478 29.1005 27.8823 29.5829 26.667 29.583C25.4515 29.583 24.2853 29.1007 23.4258 28.2412C23.1486 27.9641 22.9111 27.6545 22.7158 27.3223L16.2061 29.2754C16.234 29.5148 16.25 29.7566 16.25 30C16.25 31.6576 15.591 33.2468 14.4189 34.4189C13.2468 35.591 11.6576 36.25 10 36.25C8.3424 36.25 6.75316 35.591 5.58105 34.4189C4.40895 33.2468 3.75 31.6576 3.75 30C3.75 28.3424 4.40895 26.7532 5.58105 25.5811C6.75316 24.409 8.3424 23.75 10 23.75C11.6576 23.75 13.2468 24.409 14.4189 25.5811C14.8151 25.9772 15.1516 26.4214 15.4248 26.8994L22.085 24.9023C22.0946 24.4474 22.1723 24.0007 22.3115 23.5752L10.6992 15.5908C9.99083 16.0179 9.17397 16.25 8.33301 16.25C7.11755 16.2499 5.95224 15.7667 5.09277 14.9072C4.23331 14.0478 3.75009 12.8825 3.75 11.667C3.75 10.4514 4.23323 9.28532 5.09277 8.42578C5.95222 7.56642 7.11763 7.08309 8.33301 7.08301C9.54858 7.08301 10.7147 7.56624 11.5742 8.42578C12.0972 8.94877 12.48 9.58537 12.7002 10.2773L23.8516 8.88379C24.0772 7.64104 24.6755 6.48656 25.5811 5.58105C26.7532 4.40895 28.3424 3.75 30 3.75C31.6576 3.75 33.2468 4.40895 34.4189 5.58105C35.591 6.75316 36.25 8.3424 36.25 10Z" fill="url(#paint0_linear_4423_2341)" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" stroke="url(#paint1_linear_4423_2341)"/> <defs> <linearGradient id="paint0_linear_4423_2341" x1="20" y1="3.75" x2="20" y2="36.25" gradientUnits="userSpaceOnUse"> <stop stop-color="#BD99C9"/> <stop offset="1" stop-color="#5A0078"/> </linearGradient> <linearGradient id="paint1_linear_4423_2341" x1="20" y1="3.75" x2="20" y2="36.25" gradientUnits="userSpaceOnUse"> <stop stop-color="#DECCE4"/> <stop offset="1" stop-color="#480060"/> </linearGradient> </defs> </svg>`,
};
const SCENES = {
  connect: { src: 'scenes/connect_v2.html', title: 'Dotidot data sources' },
  vars: { src: 'scenes/variables.html', title: 'Dotidot variable editor' },
  pa: { src: 'scenes/pa.html', title: 'Dotidot Product Analytics' },
  mcp: { src: 'scenes/mcp.html', title: 'AI assistant with Dotidot MCP', url: '' },
};
