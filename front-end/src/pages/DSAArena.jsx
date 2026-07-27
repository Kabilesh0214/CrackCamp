import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ChatBot from "../components/Chatbot";

const dsaTopics = [
  // ─── Must-know ──────────────────────────────────────────────────────────────
  {
    id: 1,
    rank: 1,
    title: "Arrays & Strings",
    category: "must-know",
    categoryLabel: "Must-know",
    hours: "18–22 hrs",
    frequency: 98,
    description:
      "Most interview problems reduce to array manipulation. Sliding window and two-pointer alone will solve 30% of medium problems you encounter.",
    subtopics: [
      {
        name: "Two-pointer",
        learnUrl: "https://leetcode.com/explore/learn/card/array-and-string/",
        harderUrl: "https://leetcode.com/problems/trapping-rain-water/",
      },
      {
        name: "Sliding window",
        learnUrl:
          "https://www.geeksforgeeks.org/window-sliding-technique/",
        harderUrl:
          "https://leetcode.com/problems/minimum-window-substring/",
      },
      {
        name: "Prefix sums",
        learnUrl:
          "https://cp-algorithms.com/algebra/prefix-sums.html",
        harderUrl:
          "https://leetcode.com/problems/subarray-sum-equals-k/",
      },
      {
        name: "In-place ops",
        learnUrl:
          "https://www.geeksforgeeks.org/in-place-algorithm/",
        harderUrl:
          "https://leetcode.com/problems/rotate-array/",
      },
      {
        name: "Kadane's algo",
        learnUrl:
          "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/",
        harderUrl:
          "https://leetcode.com/problems/maximum-product-subarray/",
      },
      {
        name: "StringBuilder",
        learnUrl:
          "https://www.geeksforgeeks.org/stringbuilder-class-in-java/",
        harderUrl:
          "https://leetcode.com/problems/reverse-words-in-a-string/",
      },
    ],
  },
  {
    id: 2,
    rank: 2,
    title: "HashMap & HashSet",
    category: "must-know",
    categoryLabel: "Must-know",
    hours: "10–12 hrs",
    frequency: 95,
    description:
      "Frequency maps, deduplication, and O(1) lookup patterns appear in almost every backend interview problem. Java HashMap internals are fair game too.",
    subtopics: [
      {
        name: "Frequency counting",
        learnUrl:
          "https://www.geeksforgeeks.org/counting-frequencies-of-array-elements/",
        harderUrl:
          "https://leetcode.com/problems/top-k-frequent-elements/",
      },
      {
        name: "Two-sum pattern",
        learnUrl:
          "https://leetcode.com/problems/two-sum/solutions/",
        harderUrl:
          "https://leetcode.com/problems/four-sum/",
      },
      {
        name: "Anagram detection",
        learnUrl:
          "https://www.geeksforgeeks.org/check-whether-two-strings-are-anagram-of-each-other/",
        harderUrl:
          "https://leetcode.com/problems/group-anagrams/",
      },
      {
        name: "Grouping / bucketing",
        learnUrl:
          "https://www.geeksforgeeks.org/bucket-sort-2/",
        harderUrl:
          "https://leetcode.com/problems/sort-characters-by-frequency/",
      },
      {
        name: "Java HashMap internals",
        learnUrl:
          "https://www.geeksforgeeks.org/internal-working-of-hashmap-java/",
        harderUrl:
          "https://leetcode.com/problems/lru-cache/",
      },
    ],
  },
  {
    id: 3,
    rank: 3,
    title: "Binary Trees & BST",
    category: "must-know",
    categoryLabel: "Must-know",
    hours: "18–20 hrs",
    frequency: 90,
    description:
      "Tree traversal is ubiquitous — JSON parsing, file systems, database indexes. BFS/DFS on trees is the single most tested pattern in backend loops.",
    subtopics: [
      {
        name: "BFS (level-order)",
        learnUrl:
          "https://www.geeksforgeeks.org/level-order-tree-traversal/",
        harderUrl:
          "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
      },
      {
        name: "DFS (all 3 orders)",
        learnUrl:
          "https://www.geeksforgeeks.org/dfs-traversal-of-a-tree-using-recursion/",
        harderUrl:
          "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
      },
      {
        name: "LCA",
        learnUrl:
          "https://www.geeksforgeeks.org/lowest-common-ancestor-binary-tree-set-1/",
        harderUrl:
          "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
      },
      {
        name: "BST ops",
        learnUrl:
          "https://www.geeksforgeeks.org/binary-search-tree-set-1-search-and-insertion/",
        harderUrl:
          "https://leetcode.com/problems/recover-binary-search-tree/",
      },
      {
        name: "Serialize/deserialize",
        learnUrl:
          "https://www.geeksforgeeks.org/serialize-deserialize-binary-tree/",
        harderUrl:
          "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
      },
      {
        name: "Height & balance",
        learnUrl:
          "https://www.geeksforgeeks.org/how-to-determine-if-a-binary-tree-is-height-balanced/",
        harderUrl:
          "https://leetcode.com/problems/balanced-binary-tree/",
      },
    ],
  },
  {
    id: 4,
    rank: 4,
    title: "Two-pointer & Sliding Window",
    category: "must-know",
    categoryLabel: "Must-know",
    hours: "10–12 hrs",
    frequency: 88,
    description:
      "Reduces O(n²) brute-force solutions to O(n). These patterns are so common they deserve standalone study separate from arrays.",
    subtopics: [
      {
        name: "Same-direction pointers",
        learnUrl:
          "https://www.geeksforgeeks.org/two-pointers-technique/",
        harderUrl:
          "https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/",
      },
      {
        name: "Opposite-direction pointers",
        learnUrl:
          "https://www.geeksforgeeks.org/two-pointers-technique/",
        harderUrl:
          "https://leetcode.com/problems/container-with-most-water/",
      },
      {
        name: "Fixed window",
        learnUrl:
          "https://www.geeksforgeeks.org/window-sliding-technique/",
        harderUrl:
          "https://leetcode.com/problems/maximum-average-subarray-i/",
      },
      {
        name: "Variable window",
        learnUrl:
          "https://www.geeksforgeeks.org/variable-size-sliding-window/",
        harderUrl:
          "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      },
      {
        name: "Substring problems",
        learnUrl:
          "https://www.geeksforgeeks.org/smallest-window-in-a-string-containing-all-the-characters-of-another-string/",
        harderUrl:
          "https://leetcode.com/problems/minimum-window-substring/",
      },
    ],
  },
  {
    id: 5,
    rank: 5,
    title: "Recursion & Backtracking",
    category: "must-know",
    categoryLabel: "Must-know",
    hours: "16–18 hrs",
    frequency: 82,
    description:
      "The gateway skill. Without solid recursion you cannot do trees, graphs, or DP. Backtracking is tested directly via subsets, permutations, and constraint-search problems.",
    subtopics: [
      {
        name: "Call stack model",
        learnUrl:
          "https://www.geeksforgeeks.org/recursion/",
        harderUrl:
          "https://leetcode.com/problems/decode-ways/",
      },
      {
        name: "Base cases",
        learnUrl:
          "https://www.geeksforgeeks.org/base-case-recursion/",
        harderUrl:
          "https://leetcode.com/problems/climbing-stairs/",
      },
      {
        name: "Subsets / permutations",
        learnUrl:
          "https://www.geeksforgeeks.org/backtracking-algorithms/",
        harderUrl:
          "https://leetcode.com/problems/subsets-ii/",
      },
      {
        name: "Combinations",
        learnUrl:
          "https://www.geeksforgeeks.org/combination-sum/",
        harderUrl:
          "https://leetcode.com/problems/combination-sum-ii/",
      },
      {
        name: "Pruning",
        learnUrl:
          "https://www.geeksforgeeks.org/backtracking-introduction/",
        harderUrl:
          "https://leetcode.com/problems/n-queens/",
      },
      {
        name: "Memoization intro",
        learnUrl:
          "https://www.geeksforgeeks.org/memoization-1d-2d-and-3d/",
        harderUrl:
          "https://leetcode.com/problems/word-break/",
      },
    ],
  },
  // ─── High value ─────────────────────────────────────────────────────────────
  {
    id: 6,
    rank: 6,
    title: "Graph Traversal (BFS/DFS)",
    category: "high-value",
    categoryLabel: "High value",
    hours: "18–22 hrs",
    frequency: 80,
    description:
      "Service dependency graphs, routing, permissions — graphs are core to backend system design and interviews. Topological sort is especially common.",
    subtopics: [
      {
        name: "BFS shortest path",
        learnUrl:
          "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/",
        harderUrl:
          "https://leetcode.com/problems/word-ladder/",
      },
      {
        name: "DFS connectivity",
        learnUrl:
          "https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/",
        harderUrl:
          "https://leetcode.com/problems/number-of-islands/",
      },
      {
        name: "Topological sort",
        learnUrl:
          "https://www.geeksforgeeks.org/topological-sorting/",
        harderUrl:
          "https://leetcode.com/problems/course-schedule-ii/",
      },
      {
        name: "Cycle detection",
        learnUrl:
          "https://www.geeksforgeeks.org/detect-cycle-in-a-graph/",
        harderUrl:
          "https://leetcode.com/problems/course-schedule/",
      },
      {
        name: "Union-Find",
        learnUrl:
          "https://www.geeksforgeeks.org/union-find/",
        harderUrl:
          "https://leetcode.com/problems/number-of-provinces/",
      },
      {
        name: "Adjacency list in Java",
        learnUrl:
          "https://www.geeksforgeeks.org/graph-and-its-representations/",
        harderUrl:
          "https://leetcode.com/problems/clone-graph/",
      },
    ],
  },
  {
    id: 7,
    rank: 7,
    title: "Stacks & Queues",
    category: "high-value",
    categoryLabel: "High value",
    hours: "12–14 hrs",
    frequency: 75,
    description:
      "Monotonic stacks solve range/span problems that appear constantly. Java ArrayDeque is used in real backend code for event queues and parsers.",
    subtopics: [
      {
        name: "Monotonic stack",
        learnUrl:
          "https://www.geeksforgeeks.org/monotonic-stack/",
        harderUrl:
          "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      },
      {
        name: "Valid parentheses",
        learnUrl:
          "https://www.geeksforgeeks.org/check-for-balanced-parentheses-in-an-expression/",
        harderUrl:
          "https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/",
      },
      {
        name: "Min stack",
        learnUrl:
          "https://www.geeksforgeeks.org/design-a-stack-that-supports-getmin-in-o1-time-and-o1-extra-space/",
        harderUrl:
          "https://leetcode.com/problems/min-stack/",
      },
      {
        name: "Deque patterns",
        learnUrl:
          "https://www.geeksforgeeks.org/deque-set-1-introduction-applications/",
        harderUrl:
          "https://leetcode.com/problems/sliding-window-maximum/",
      },
      {
        name: "Java ArrayDeque",
        learnUrl:
          "https://www.geeksforgeeks.org/arraydeque-in-java/",
        harderUrl:
          "https://leetcode.com/problems/implement-queue-using-stacks/",
      },
    ],
  },
  {
    id: 8,
    rank: 8,
    title: "Binary Search",
    category: "high-value",
    categoryLabel: "High value",
    hours: "10–12 hrs",
    frequency: 72,
    description:
      "Applies far beyond sorted arrays — searching on the answer space is a pattern that appears in capacity planning and optimization problems.",
    subtopics: [
      {
        name: "Classic binary search",
        learnUrl:
          "https://www.geeksforgeeks.org/binary-search/",
        harderUrl:
          "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/",
      },
      {
        name: "Rotated array",
        learnUrl:
          "https://www.geeksforgeeks.org/search-an-element-in-a-sorted-and-pivoted-array/",
        harderUrl:
          "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
      },
      {
        name: "First/last position",
        learnUrl:
          "https://www.geeksforgeeks.org/find-first-and-last-positions-of-an-element-in-a-sorted-array/",
        harderUrl:
          "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
      },
      {
        name: "Search on answer space",
        learnUrl:
          "https://www.geeksforgeeks.org/binary-search-on-answers-tutorial-with-problems/",
        harderUrl:
          "https://leetcode.com/problems/koko-eating-bananas/",
      },
      {
        name: "Boundary conditions",
        learnUrl:
          "https://www.geeksforgeeks.org/binary-search-leftrightmost-occurrence/",
        harderUrl:
          "https://leetcode.com/problems/find-peak-element/",
      },
    ],
  },
  {
    id: 9,
    rank: 9,
    title: "Linked Lists",
    category: "high-value",
    categoryLabel: "High value",
    hours: "12–14 hrs",
    frequency: 68,
    description:
      "Pointer manipulation is foundational reasoning. LRU cache (extremely common) is built on a linked list + hashmap combo.",
    subtopics: [
      {
        name: "Fast/slow pointers",
        learnUrl:
          "https://www.geeksforgeeks.org/floyds-cycle-detection-algorithm/",
        harderUrl:
          "https://leetcode.com/problems/linked-list-cycle-ii/",
      },
      {
        name: "Reversal",
        learnUrl:
          "https://www.geeksforgeeks.org/reverse-a-linked-list/",
        harderUrl:
          "https://leetcode.com/problems/reverse-nodes-in-k-group/",
      },
      {
        name: "Cycle detection",
        learnUrl:
          "https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/",
        harderUrl:
          "https://leetcode.com/problems/linked-list-cycle/",
      },
      {
        name: "Merge sorted lists",
        learnUrl:
          "https://www.geeksforgeeks.org/merge-two-sorted-linked-lists/",
        harderUrl:
          "https://leetcode.com/problems/merge-k-sorted-lists/",
      },
      {
        name: "LRU cache implementation",
        learnUrl:
          "https://www.geeksforgeeks.org/lru-cache-implementation/",
        harderUrl:
          "https://leetcode.com/problems/lru-cache/",
      },
    ],
  },
  {
    id: 10,
    rank: 10,
    title: "Heaps / Priority Queue",
    category: "high-value",
    categoryLabel: "High value",
    hours: "10–12 hrs",
    frequency: 65,
    description:
      "Task scheduling, top-K problems, and real-time event processing all use heaps. Java PriorityQueue with custom comparators is practical knowledge.",
    subtopics: [
      {
        name: "Min/max heap",
        learnUrl:
          "https://www.geeksforgeeks.org/heap-data-structure/",
        harderUrl:
          "https://leetcode.com/problems/find-median-from-data-stream/",
      },
      {
        name: "Top-K elements",
        learnUrl:
          "https://www.geeksforgeeks.org/k-largestor-smallest-elements-in-an-array/",
        harderUrl:
          "https://leetcode.com/problems/k-closest-points-to-origin/",
      },
      {
        name: "K-way merge",
        learnUrl:
          "https://www.geeksforgeeks.org/merge-k-sorted-arrays/",
        harderUrl:
          "https://leetcode.com/problems/merge-k-sorted-lists/",
      },
      {
        name: "Median stream",
        learnUrl:
          "https://www.geeksforgeeks.org/median-of-stream-of-integers-running-integers/",
        harderUrl:
          "https://leetcode.com/problems/find-median-from-data-stream/",
      },
      {
        name: "Java PriorityQueue",
        learnUrl:
          "https://www.geeksforgeeks.org/priority-queue-class-in-java/",
        harderUrl:
          "https://leetcode.com/problems/task-scheduler/",
      },
    ],
  },
  {
    id: 11,
    rank: 11,
    title: "Sorting (Deep Understanding)",
    category: "high-value",
    categoryLabel: "High value",
    hours: "8–10 hrs",
    frequency: 60,
    description:
      "Not rote memorization — knowing when to pick merge vs quicksort, and how Java's sort works, signals systems thinking.",
    subtopics: [
      {
        name: "Merge sort",
        learnUrl:
          "https://www.geeksforgeeks.org/merge-sort/",
        harderUrl:
          "https://leetcode.com/problems/sort-list/",
      },
      {
        name: "Quick sort + partitioning",
        learnUrl:
          "https://www.geeksforgeeks.org/quick-sort/",
        harderUrl:
          "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      },
      {
        name: "Java Arrays.sort internals",
        learnUrl:
          "https://www.geeksforgeeks.org/arrays-sort-in-java-with-examples/",
        harderUrl:
          "https://leetcode.com/problems/maximum-gap/",
      },
      {
        name: "Custom comparators",
        learnUrl:
          "https://www.geeksforgeeks.org/comparator-interface-java/",
        harderUrl:
          "https://leetcode.com/problems/largest-number/",
      },
      {
        name: "Counting sort",
        learnUrl:
          "https://www.geeksforgeeks.org/counting-sort/",
        harderUrl:
          "https://leetcode.com/problems/sort-colors/",
      },
    ],
  },
  // ─── Go deeper ──────────────────────────────────────────────────────────────
  {
    id: 12,
    rank: 12,
    title: "Dynamic Programming",
    category: "go-deeper",
    categoryLabel: "Go deeper",
    hours: "18–22 hrs",
    frequency: 50,
    description:
      "Appears in ~30% of senior backend interviews. Master the 5–6 canonical patterns (not every variant). DP pattern recognition matters more than novelty.",
    subtopics: [
      {
        name: "1D DP (coin change, stairs)",
        learnUrl:
          "https://www.geeksforgeeks.org/dynamic-programming/",
        harderUrl:
          "https://leetcode.com/problems/coin-change-2/",
      },
      {
        name: "2D DP (grid, edit distance)",
        learnUrl:
          "https://www.geeksforgeeks.org/edit-distance-dp-5/",
        harderUrl:
          "https://leetcode.com/problems/edit-distance/",
      },
      {
        name: "Knapsack variants",
        learnUrl:
          "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",
        harderUrl:
          "https://leetcode.com/problems/partition-equal-subset-sum/",
      },
      {
        name: "Substring DP",
        learnUrl:
          "https://www.geeksforgeeks.org/longest-palindromic-subsequence-dp-12/",
        harderUrl:
          "https://leetcode.com/problems/longest-palindromic-substring/",
      },
      {
        name: "DP on trees",
        learnUrl:
          "https://www.geeksforgeeks.org/dp-on-trees/",
        harderUrl:
          "https://leetcode.com/problems/house-robber-iii/",
      },
      {
        name: "Memo vs tabulation",
        learnUrl:
          "https://www.geeksforgeeks.org/tabulation-vs-memoization/",
        harderUrl:
          "https://leetcode.com/problems/burst-balloons/",
      },
    ],
  },
  {
    id: 13,
    rank: 13,
    title: "Tries",
    category: "go-deeper",
    categoryLabel: "Go deeper",
    hours: "8–10 hrs",
    frequency: 42,
    description:
      "Autocomplete, search indexing, IP routing tables. One of the few advanced structures with direct, concrete backend applicability.",
    subtopics: [
      {
        name: "Insert/search/delete",
        learnUrl:
          "https://www.geeksforgeeks.org/trie-insert-and-search/",
        harderUrl:
          "https://leetcode.com/problems/implement-trie-prefix-tree/",
      },
      {
        name: "Prefix matching",
        learnUrl:
          "https://www.geeksforgeeks.org/trie-memory-optimization-using-hash-map/",
        harderUrl:
          "https://leetcode.com/problems/design-search-autocomplete-system/",
      },
      {
        name: "Word search II",
        learnUrl:
          "https://www.geeksforgeeks.org/boggle-find-possible-words-board-characters/",
        harderUrl:
          "https://leetcode.com/problems/word-search-ii/",
      },
      {
        name: "Wildcard matching",
        learnUrl:
          "https://www.geeksforgeeks.org/wildcard-character-matching/",
        harderUrl:
          "https://leetcode.com/problems/add-and-search-word-data-structure-design/",
      },
      {
        name: "Map sum pairs",
        learnUrl:
          "https://www.geeksforgeeks.org/map-sum-pairs/",
        harderUrl:
          "https://leetcode.com/problems/map-sum-pairs/",
      },
    ],
  },
  {
    id: 14,
    rank: 14,
    title: "System Design DSA",
    category: "go-deeper",
    categoryLabel: "Go deeper",
    hours: "12–14 hrs",
    frequency: 38,
    description:
      "Backend interviews often blend algo and design. LRU cache, rate limiters, and consistent hashing are high-value intersections.",
    subtopics: [
      {
        name: "LRU / LFU cache design",
        learnUrl:
          "https://www.geeksforgeeks.org/lru-cache-implementation/",
        harderUrl:
          "https://leetcode.com/problems/lfu-cache/",
      },
      {
        name: "Rate limiter algorithms",
        learnUrl:
          "https://www.geeksforgeeks.org/rate-limiting-algorithms/",
        harderUrl:
          "https://leetcode.com/problems/design-hit-counter/",
      },
      {
        name: "Consistent hashing",
        learnUrl:
          "https://www.geeksforgeeks.org/consistent-hashing/",
        harderUrl:
          "https://leetcode.com/problems/design-hashmap/",
      },
      {
        name: "Bloom filters (conceptual)",
        learnUrl:
          "https://www.geeksforgeeks.org/bloom-filters-introduction-and-python-implementation/",
        harderUrl:
          "https://leetcode.com/problems/design-hashset/",
      },
      {
        name: "Time-based key-value store",
        learnUrl:
          "https://www.geeksforgeeks.org/design-a-time-based-key-value-data-structure/",
        harderUrl:
          "https://leetcode.com/problems/time-based-key-value-store/",
      },
    ],
  },
  {
    id: 15,
    rank: 15,
    title: "Complexity Analysis",
    category: "go-deeper",
    categoryLabel: "Go deeper",
    hours: "5–6 hrs",
    frequency: null,
    description:
      "Not a topic — a skill you apply everywhere. Every solution needs a stated time/space complexity. Amortized analysis matters for Java collections.",
    subtopics: [
      {
        name: "Big-O notation",
        learnUrl:
          "https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/",
        harderUrl:
          "https://leetcode.com/explore/learn/card/recursion-i/256/complexity-analysis/",
      },
      {
        name: "Space vs time tradeoffs",
        learnUrl:
          "https://www.geeksforgeeks.org/time-complexity-and-space-complexity/",
        harderUrl:
          "https://leetcode.com/problems/two-sum/",
      },
      {
        name: "Amortized analysis",
        learnUrl:
          "https://www.geeksforgeeks.org/amortized-analysis-introduction/",
        harderUrl:
          "https://leetcode.com/problems/design-circular-deque/",
      },
      {
        name: "Java collection complexities",
        learnUrl:
          "https://www.geeksforgeeks.org/time-complexities-of-different-data-structures/",
        harderUrl:
          "https://leetcode.com/problems/design-a-stack-with-increment-operation/",
      },
    ],
  },
];

const categoryConfig = {
  "must-know": {
    label: "Must-know",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.3)",
    glow: "rgba(16, 185, 129, 0.2)",
    icon: "🔥",
  },
  "high-value": {
    label: "High value",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.12)",
    border: "rgba(59, 130, 246, 0.3)",
    glow: "rgba(59, 130, 246, 0.2)",
    icon: "⚡",
  },
  "go-deeper": {
    label: "Go deeper",
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.12)",
    border: "rgba(168, 85, 247, 0.3)",
    glow: "rgba(168, 85, 247, 0.2)",
    icon: "🧠",
  },
};

function FrequencyBar({ frequency, color }) {
  if (frequency === null)
    return (
      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
        Universal skill
      </span>
    );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          flex: 1,
          height: "6px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "99px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${frequency}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            borderRadius: "99px",
            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: `0 0 6px ${color}88`,
          }}
        />
      </div>
      <span
        style={{ fontSize: "0.8rem", fontWeight: 700, color, minWidth: "36px" }}
      >
        {frequency}%
      </span>
    </div>
  );
}

function SubtopicChip({ subtopic, catColor, isCompleted, onToggle }) {
  return (
    <div className="dsa-subtopic-chip" style={{ opacity: isCompleted ? 0.85 : 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="checkbox"
          className="dsa-subtopic-check"
          checked={isCompleted}
          onChange={onToggle}
          title={isCompleted ? "Mark as incomplete" : "Mark as completed"}
        />
        <span className="dsa-subtopic-name" style={{ textDecoration: isCompleted ? "line-through" : "none" }}>{subtopic.name}</span>
      </div>
      <div className="dsa-subtopic-links">
        <a
          href={subtopic.learnUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="dsa-chip-link dsa-chip-link--learn"
          title="Learn this concept"
        >
          Learn →
        </a>
        <a
          href={subtopic.harderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="dsa-chip-link dsa-chip-link--hard"
          title="Harder practice problem"
        >
          Hard 🔗
        </a>
      </div>
    </div>
  );
}

function TopicCard({ topic, expanded, onToggle, progress, onSubtopicToggle }) {
  const cat = categoryConfig[topic.category];
  const completedCount = progress?.length ?? 0;
  const totalCount = topic.subtopics.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      className={`dsa-topic-card ${expanded ? "expanded" : ""}`}
      style={{
        "--cat-color": cat.color,
        "--cat-bg": cat.bg,
        "--cat-border": cat.border,
        "--cat-glow": cat.glow,
      }}
    >
      {/* Rank badge */}
      <div className="dsa-rank-badge">#{topic.rank}</div>

      {/* Card header */}
      <div className="dsa-card-header" onClick={onToggle}>
        <div className="dsa-card-header-left">
          <span className="dsa-category-pill">
            {cat.icon} {cat.label}
          </span>
          <h3 className="dsa-topic-title">{topic.title}</h3>
          <span className="dsa-hours">{topic.hours}</span>
        </div>
        <div className="dsa-card-header-right">
          <div style={{ marginBottom: "8px" }}>
            <FrequencyBar frequency={topic.frequency} color={cat.color} />
          </div>
          <button className="dsa-expand-btn">
            {expanded ? "▲ Collapse" : "▼ Subtopics"}
          </button>
        </div>
      </div>

      <p className="dsa-topic-desc">{topic.description}</p>

      {/* Per-topic progress bar */}
      <div className="dsa-topic-progress">
        <span>{completedCount}/{totalCount}</span>
        <div className="dsa-topic-progress-bar">
          <div className="dsa-topic-progress-fill" style={{ width: `${progressPct}%`, background: cat.color }} />
        </div>
        <span style={{ color: completedCount === totalCount && totalCount > 0 ? cat.color : undefined }}>
          {completedCount === totalCount && totalCount > 0 ? "✓ Done" : `${progressPct}%`}
        </span>
      </div>

      {/* Expandable subtopics */}
      {expanded && (
        <div className="dsa-subtopics-panel">
          <div className="dsa-subtopics-label">Subtopics with resources</div>
          <div className="dsa-subtopics-grid">
            {topic.subtopics.map((st) => (
              <SubtopicChip
                key={st.name}
                subtopic={st}
                catColor={cat.color}
                isCompleted={progress?.includes(st.name) ?? false}
                onToggle={() => onSubtopicToggle(topic.id, st.name)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DSAArena() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [dsaProgress, setDsaProgress] = useState({}); // { topicId: [subtopicName, ...] }

  // Load saved progress on mount
  useEffect(() => {
    api.get("/dashboard/dsa/progress")
      .then(res => setDsaProgress(res.data || {}))
      .catch(err => console.error("Failed to load DSA progress:", err));
  }, []);

  const handleSubtopicToggle = async (topicId, subtopicName) => {
    try {
      const res = await api.post("/dashboard/dsa/toggle", { topicId, subtopicName });
      setDsaProgress(prev => {
        const updated = { ...prev };
        const key = String(topicId);
        const current = updated[key] || [];
        if (res.data.completed) {
          updated[key] = [...current, subtopicName];
        } else {
          updated[key] = current.filter(n => n !== subtopicName);
        }
        return updated;
      });
    } catch (err) {
      console.error("Failed to toggle subtopic:", err);
    }
  };

  const filters = [
    { key: "all", label: "All Topics", icon: "📋" },
    { key: "must-know", label: "Must-know", icon: "🔥" },
    { key: "high-value", label: "High value", icon: "⚡" },
    { key: "go-deeper", label: "Go deeper", icon: "🧠" },
  ];

  const filtered =
    activeFilter === "all"
      ? dsaTopics
      : dsaTopics.filter((t) => t.category === activeFilter);

  const handleToggle = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div>
          <div className="sidebar-brand">
            <span>🚀</span> CrackCamp
          </div>
          <nav>
            <ul className="sidebar-menu">
              <li>
                <Link to="/dashboard" className="menu-item">
                  <span>📊</span> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/self-intro" className="menu-item">
                  <span>🎥</span> Interview Prep
                </Link>
              </li>
              <li>
                <Link to="/dsa-arena" className="menu-item active">
                  <span>⚔️</span> DSA Arena
                </Link>
              </li>
              <li>
                <Link to="/mcq" className="menu-item">
                  <span>🧪</span> MCQ Test
                </Link>
              </li>
              <li>
                <Link to="/question-bank" className="menu-item">
                  <span>📋</span> Question Bank
                </Link>
              </li>
              <li>
                <Link to="/resume" className="menu-item">
                  <span>📄</span> Resume Analyser
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="menu-item">
                  <span>🗺️</span> My Roadmap
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <Link
            to="/login"
            className="btn btn-secondary"
            style={{ width: "100%", justifyContent: "flex-start", gap: "10px", textDecoration: "none" }}
          >
            <span>🚪</span> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-welcome">
            <h2>DSA Practice Arena</h2>
            <p>
              Master the patterns that matter. Sorted by interview frequency —
              start from the top.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="role-badge">
              {filtered.length} / {dsaTopics.length} Topics
            </span>
          </div>
        </header>

        {/* Stats bar */}
        <div className="dsa-stats-bar">
          {[
            { label: "Must-know", count: 5, color: "#10b981", icon: "🔥" },
            { label: "High value", count: 6, color: "#3b82f6", icon: "⚡" },
            { label: "Go deeper", count: 4, color: "#a855f7", icon: "🧠" },
            { label: "Total hours", count: "~185", color: "#f59e0b", icon: "⏱️" },
          ].map((s) => (
            <div key={s.label} className="dsa-stat-item">
              <span className="dsa-stat-icon">{s.icon}</span>
              <span
                className="dsa-stat-count"
                style={{ color: s.color }}
              >
                {s.count}
              </span>
              <span className="dsa-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="dsa-filter-bar">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`dsa-filter-btn ${activeFilter === f.key ? "active" : ""}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Topic list */}
        <div className="dsa-topic-list">
          {filtered.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              expanded={expandedId === topic.id}
              onToggle={() => handleToggle(topic.id)}
              progress={dsaProgress[String(topic.id)] || []}
              onSubtopicToggle={handleSubtopicToggle}
            />
          ))}
        </div>
      </main>

      <ChatBot />
    </div>
  );
}

export default DSAArena;
