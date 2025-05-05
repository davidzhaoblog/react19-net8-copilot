# React - 2025: popular npm packages

## Design Tools:
[Figma.com](https://www.figma.com/?utm_source=google&utm_medium=cpc&utm_campaign=21284800681&utm_term=figma&utm_content=699203569595&utm_adgroup=169015407344&gad_source=1&gad_campaignid=21284800681&gbraid=0AAAAACTf0kM1Wj3sOjnqtHIp8tQZ-Xh9F&gclid=Cj0KCQjw_dbABhC5ARIsAAh2Z-Sv9-u64NBWZV6YRX7DsdYg9XGM8dbfBdhzxJ3E4ltCh5giA7u9qe4aAk16EALw_wcB)
[builder.io](https://www.builder.io/?utm_device=c&utm_network=g&utm_term=builder%20io&utm_campaign=Brand_Search_New&utm_source=adwords&utm_medium=ppc&hsa_acc=8119935409&hsa_cam=21605439569&hsa_grp=164971289943&hsa_ad=710225573476&hsa_src=g&hsa_tgt=kwd-878689654950&hsa_kw=builder%20io&hsa_mt=e&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=21605439569&gbraid=0AAAAACUA9YnEBL4kPYlgTzv8-xd1NdhTX&gclid=Cj0KCQjw_dbABhC5ARIsAAh2Z-RP6cwkXa8Cgr2bW9N7QoU6YA0IMBKnrslJA3uaMKZSwMKh4zA14OQaArDXEALw_wcB)

## Deployment
[Vercel](https://vercel.com/)

## Authentication
www.clerk.com

## Component Development
[Storybook](https://storybook.js.org/)

## mobile
[React Native](https://reactnative.dev/)

## Database
supabase

## Form
[React Hook Form](https://react-hook-form.com/)

## Testing
Vitest
Ject

## Amination
[motion](https://motion.dev/)

## State and WebApi Client
[Zustand](https://zustand-demo.pmnd.rs/), [Zustand Github](https://github.com/pmndrs/zustand)
[TanStack Query v5](https://tanstack.com/query/latest)

## Component Library
[shadcn/ui](https://ui.shadcn.com/)
### Table
[TanStack Table](https://tanstack.com/table/latest)

## Styling css
[tailwindcss](https://tailwindcss.com/)

## Framework, e.g. Routing
[Next.js](https://nextjs.org/)
Remix
[TanStack](https://tanstack.com/)

# 2025-05-01, result from npm install 

"
PS D:\Github_Blog\react19-net8-copilot\reactts> npm install
`npm warn deprecated inflight@1.0.61`: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
`npm warn deprecated glob@7.2.3`: Glob versions prior to v9 are no longer supported
`npm warn deprecated abab@2.0.6`: Use your platform's native atob() and btoa() methods instead
`npm warn deprecated domexception@4.0.0`: Use your platform's native DOMException instead

added 590 packages, and audited 591 packages in 54s

89 packages are looking for funding
  run `npm fund` for details

`found 0 vulnerabilities`
PS D:\Github_Blog\react19-net8-copilot\reactt
"

# MUI + tailwindcss

`npm install @mui/material @mui/styled-engine-sc styled-components`
`npm install tailwindcss`

# Jest + @testing-library/react

`npm install --save-dev @testing-library/react @testing-library/dom`
`npm install --save-dev jest ts-jest @types/jest`
`npm install --save-dev @testing-library/jest-dom jest-environment-jsdom ts-node`

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
