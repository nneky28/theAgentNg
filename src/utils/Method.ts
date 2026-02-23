export const formatPrice = (price: string | number, currency: 'NGN' | 'USD' = 'NGN') => {
  if (price === null || price === undefined || price === '') return 'N/A';

  // Remove any existing currency symbols and commas
  const numericValue =
    typeof price === 'string'
      ? price.replace(/[₦$,NGN\s]/g, '')
      : price.toString();

  const priceNum = parseFloat(numericValue);

  if (isNaN(priceNum)) return price;

  const currencySymbol = currency === 'USD' ? '$' : '₦';
  
  return `${currencySymbol}${priceNum.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};
import * as React from "react";

export const formatTitleCase = (text: string) => {
  if (!text) return "";

const cleaned = text.replace(/(\d+)-(\w+)/g, "$1 $2");
  return cleaned
    .split(/[\s-]+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};

export type DescriptionBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "spacer"; height?: number };

export const parseDescription = (
  text: string,
  bulletChars: string[] = ["•", "-"]
): DescriptionBlock[] => {
  if (!text) return [];
  const lines = text.split("\n");
  const blocks: DescriptionBlock[] = [];
  let currentList: string[] = [];

  const isBullet = (s: string) => {
    return bulletChars.some((c) => s.startsWith(c));
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (isBullet(trimmed)) {
      currentList.push(trimmed.replace(new RegExp(`^[${bulletChars.join('')}]\\\s*`), "").replace(/^[•\-]\s*/, ""));
    } else {
      if (currentList.length > 0) {
        blocks.push({ type: "list", items: currentList });
        currentList = [];
      }

      if (trimmed) {
        blocks.push({ type: "paragraph", text: trimmed });
      } else {
        blocks.push({ type: "spacer", height: 8 });
      }
    }
  });

  if (currentList.length > 0) {
    blocks.push({ type: "list", items: currentList });
  }

  return blocks;
};

type ComponentsOption = {
  Paragraph?: React.ComponentType<any>;
  List?: React.ComponentType<any>;
  ListItem?: React.ComponentType<any>;
  Spacer?: React.ComponentType<any>;
};

export const formatDescription = (
  text: string,
  options?: { components?: ComponentsOption; bulletChars?: string[] }
): React.ReactNode[] => {
  const blocks = parseDescription(text, options?.bulletChars);

  const defaultComps: Required<ComponentsOption> = {
    Paragraph: (props: any) =>
      React.createElement(
        "p",
        { style: { marginBottom: 8, marginTop: 0 }, ...props },
        props.children
      ),
    List: (props: any) =>
      React.createElement(
        "ul",
        { style: { paddingLeft: 24, margin: "12px 0" }, ...props },
        props.children
      ),
    ListItem: (props: any) =>
      React.createElement(
        "li",
        { style: { marginBottom: 4 }, ...props },
        props.children
      ),
    Spacer: (props: any) =>
      React.createElement("div", { style: { height: props.height ?? 8 } }),
  };

  const comps = { ...defaultComps, ...(options?.components || {}) } as Required<ComponentsOption>;

  const nodes: React.ReactNode[] = [];

  blocks.forEach((b, idx) => {
    if (b.type === "paragraph") {
      nodes.push(React.createElement(comps.Paragraph, { key: `p-${idx}` }, b.text));
    } else if (b.type === "list") {
      const items = b.items.map((it, i) => React.createElement(comps.ListItem, { key: `li-${idx}-${i}` }, it));
      nodes.push(React.createElement(comps.List, { key: `list-${idx}` }, items));
    } else if (b.type === "spacer") {
      nodes.push(React.createElement(comps.Spacer, { key: `sp-${idx}`, height: b.height }));
    }
  });

  return nodes;
};