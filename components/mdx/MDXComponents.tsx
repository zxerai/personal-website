import { CodeBlock } from './CodeBlock';
import { SmartLink } from './SmartLink';
import { Heading } from './Heading';
import { Callout } from './Callout';

/**
 * MDX 组件映射：覆盖默认 HTML 元素，自定义渲染
 *
 * 在 lib/mdx.ts 调用 next-mdx-remote 时传入：
 *   <MDXRemote components={mdxComponents} ... />
 */
export const mdxComponents = {
  // 自定义代码块
  pre: CodeBlock,
  // 智能链接（自动判断外链）
  a: SmartLink,
  // 标题自动加锚点
  h1: (props: any) => <Heading level={1} {...props} />,
  h2: (props: any) => <Heading level={2} {...props} />,
  h3: (props: any) => <Heading level={3} {...props} />,
  h4: (props: any) => <Heading level={4} {...props} />,
  // Callout 组件（在 MDX 中使用 <Note>...</Note> 或 <Warning>...</Warning>）
  Note: (props: any) => <Callout type="info" {...props} />,
  Warning: (props: any) => <Callout type="warning" {...props} />,
  Success: (props: any) => <Callout type="success" {...props} />,
  Danger: (props: any) => <Callout type="danger" {...props} />,
} as const;

export type MDXComponents = typeof mdxComponents;
