import * as React from "react"

import { cn } from "@/lib/utils"

interface RichTextProps {
  text: string
  /** Extra classes on the wrapper. */
  className?: string
  /** Extra classes on each inline <code> token. */
  codeClassName?: string
}

type Token = { type: "text" | "code"; value: string; key: string }

/**
 * Renders a string where `backtick-wrapped` segments become styled inline
 * <code> elements. Newlines are preserved. Intentionally narrow scope — this
 * is not a Markdown renderer, just the one feature we actually need.
 *
 * A lone unmatched backtick is rendered as plain text.
 */
export function RichText({ text, className, codeClassName }: RichTextProps) {
  const nodes = React.useMemo(() => parse(text), [text])
  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      {nodes.map((node) =>
        node.type === "code" ? (
          <code
            key={node.key}
            className={cn(
              "rounded-md border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[0.85em] leading-[1.2] text-foreground",
              codeClassName
            )}
          >
            {node.value}
          </code>
        ) : (
          <React.Fragment key={node.key}>{node.value}</React.Fragment>
        )
      )}
    </span>
  )
}

function parse(input: string): Token[] {
  const tokens: Token[] = []
  let buffer = ""
  let i = 0
  let counter = 0
  while (i < input.length) {
    const ch = input[i]
    if (ch === "`") {
      const end = input.indexOf("`", i + 1)
      if (end === -1) {
        buffer += input.slice(i)
        break
      }
      if (buffer) {
        tokens.push({ type: "text", value: buffer, key: `t${counter++}` })
        buffer = ""
      }
      tokens.push({
        type: "code",
        value: input.slice(i + 1, end),
        key: `c${counter++}`,
      })
      i = end + 1
      continue
    }
    buffer += ch
    i++
  }
  if (buffer) tokens.push({ type: "text", value: buffer, key: `t${counter++}` })
  return tokens
}
