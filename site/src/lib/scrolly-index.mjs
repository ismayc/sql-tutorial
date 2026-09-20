// Registry of every scroll-driven diagram on the site, in page and reading
// order. The gallery at src/pages/scrollytelling/index.astro renders this, and
// each entry deep-links to `examples/<slug>#<act.id>` (the id Scrolly.astro puts
// on its <section>). Add a new act here when you add it to a page.
//
// `question` is the learner's confusion the diagram answers, shown on the card.
// `pageTitle` names the page when it is not "<title> Techniques".

import { innerAct, leftAct, multiAct, antiAct } from "./scrolly-diagrams.mjs";
import { clauseOrderAct, groupByAct, wherePrecedenceAct } from "./scrolly-diagrams-sql.mjs";
import {
  selectColumnsAct,
  distinctAct,
  countAct,
  betweenInAct,
  likeAct,
  nullAct,
  orderByAct,
  aggregateAct,
  subqueryAct,
  caseWhenAct,
  integerDivisionAct,
  countJoinAct,
} from "./scrolly-diagrams-more.mjs";

export const SCROLLY_GROUPS = [
  {
    slug: "selection-techniques",
    title: "Selection",
    items: [
      { act: selectColumnsAct, question: "Does SELECT remove rows? What does AS change?" },
      { act: distinctAct, question: "What counts as a duplicate, with one column and with two?" },
      { act: countAct, question: "Why do three COUNTs of the same table give 6, 3, and 2?" },
    ],
  },
  {
    slug: "filtering-techniques",
    title: "Filtering",
    items: [
      { act: betweenInAct, question: "Is the boundary value included? What does IN replace?" },
      { act: wherePrecedenceAct, question: "Why did mixing AND with OR return the wrong rows?" },
      { act: likeAct, question: "Which letters does % cover, and how is _ different?" },
      { act: nullAct, question: "Why does = NULL return nothing, with no error?" },
    ],
  },
  {
    slug: "aggregating-techniques",
    title: "Aggregating",
    items: [
      { act: aggregateAct, question: "What do SUM, AVG, MIN, and MAX do with a NULL?" },
    ],
  },
  {
    slug: "sorting-and-grouping-techniques",
    title: "Sorting and Grouping",
    items: [
      { act: clauseOrderAct, question: "Why can't WHERE see my SELECT alias?" },
      { act: orderByAct, question: "What does the second ORDER BY column do?" },
      { act: groupByAct, question: "How do many rows become one row per group? WHERE or HAVING?" },
    ],
  },
  {
    slug: "transforming-techniques",
    title: "Transforming",
    items: [
      { act: caseWhenAct, question: "Why is every row labeled with the first category?" },
      { act: integerDivisionAct, question: "Why is my percentage column all zeros?" },
    ],
  },
  {
    slug: "joining-techniques",
    title: "Joining",
    items: [
      { act: innerAct, question: "Which rows survive an INNER JOIN?" },
      { act: leftAct, question: "Where do the NULLs in a LEFT JOIN come from?" },
      { act: multiAct, question: "Why did my row count go up after a join?" },
      { act: antiAct, question: "How do I find the rows with no match?" },
    ],
  },
  {
    // Beyond a first session: not presented live, kept for learners who want more.
    slug: "going-further",
    title: "Going Further",
    pageTitle: "Going Further",
    items: [
      { act: subqueryAct, question: "How do I get the row that holds the minimum, not only the number?" },
      { act: countJoinAct, question: "Why does a county with no towns show a count of 1?" },
    ],
  },
];

export const SCROLLY_COUNT = SCROLLY_GROUPS.reduce((n, g) => n + g.items.length, 0);
