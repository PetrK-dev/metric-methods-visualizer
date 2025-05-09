/**
 * Contains pseudocode representations of M-Tree algorithms for educational visualization.
 * Each constant is an array of strings where each string represents a line of pseudocode.
 * These pseudocodes are used to display algorithm steps during visualization.
 */

/**
 * Pseudocode for the dynamic insertion algorithm in M-Tree.
 * 
 * This algorithm handles inserting a new point into an M-Tree structure.
 * It includes three main parts:
 * 1. Main insertion logic
 * 2. FindLeaf procedure to locate the appropriate leaf node for insertion
 * 3. SplitNode procedure to handle node splitting when a node becomes full
 * 
 * The algorithm supports tree growth both in width and height, with recursive
 * splitting when necessary.
 */
export const PSEUDOCODE_MTREE_DYNAMIC_INSERT = [
  'M-Tree InsertObject(T, q):',
  '  if T is empty',
  '   return store node(q) in T',
  '  end if',
  '  N = FindLeaf(T, q)',
  '  if N is not full then',
  '    store q in the leaf node N',
  '  else',
  '    SplitNode(N, q)',
  '  end if',
  'END',
  '----------------------------------------',
  // Nalezení listového uzlu
  'FindLeaf(N, q):',
  '  if N is a leaf node then',
  '    return N',
  '  end if',
  '  N\' = {∀_rout(o_j) ∈ N: d(q,o_j) ≤ r_o_j}',
  '  if N\' ≠ ∅ then',
  '    select o_j* where rout(o_j*) ∈ N\': min{d(o_j*, q)}',
  '  else',
  '    select o_j* where rout(o_j*) ∈ N: min{d(o_j*, q) - r_o_j*}',
  '    r_o_j* = max(r_o_j*, d(o_j*, q))',
  '  end if',
  'return FindLeaf(ptr(T(o_j*)), q)',
  '----------------------------------------',
  // Rozdělení uzlu
  'SplitNode(N, q):',
  '  N_all = {∀_o_j: o_j ∈ N} ∪ {q}',
  '  Promote(N_all, o_p1, o_p2)',
  '  Partition(N_all, o_p1, o_p2, N_p1, N_p2)',
  '  Allocate a new node N\'',
  '  store entries from N_p1 into N and entries from N_p2 into N\'',
  '  if N is the root node then',
  '    allocate a new root node N_p',
  '    store rout(o_p1) and rout(o_p2) in N_p',
  '  else',
  '    let rout(o_p) be the routing entry of N stored in parent node N_p',
  '    replace entry rout(o_p) with rout(o_p1) in N_p',
  '    if N_p is full then',
  '      SplitNode(N_p, o_p2)',
  '    else',
  '      store rout(o_p2) in N_p',
  '    end if',
  '  end if',
  'END'
];
  
/**
 * Pseudocode for the range query algorithm in M-Tree.
 * 
 * This algorithm performs a range search, finding all points within a specified
 * radius from the query point. It utilizes the triangle inequality property of
 * the metric space to efficiently prune branches of the tree during search.
 * 
 * The algorithm consists of:
 * 1. Main function that initializes the search
 * 2. RangeQueryIter recursive function that traverses the tree
 * 
 * The implementation handles both internal nodes (with routing objects) and
 * leaf nodes (with data objects).
 */
export const PSEUDOCODE_MTREE_RANGE = [
  'MTree_Range(T, q, r):',
  '  S = ∅',
  '  RangeQueryIter(T.root, q, r, S, null, null)',
  'return S',
  '----------------------------------------',
  'RangeQueryIter(N, q, r, S, o_p, d_parent):',
  '  if N is not a leaf node then',
  '    for each routing(o_j) ∈ N do',
  '      eliminated = false',
  '      if o_p is not null then',
  '        lb = |d_parent - d(o_j, o_p)|',
  '        sumR = r + r_o_j',
  '        if lb > sumR then',
  '          eliminated = true',
  '        end if',
  '      end if',
  '      if not eliminated then',
  '        compute d(o_j, q)',
  '        sumR = r + r_o_j',
  '        if d(o_j, q) ≤ sumR then',
  '          RangeQueryIter(o_j.childNode, q, r, S, o_j, d(o_j, q))',
  '        end if',
  '      end if',
  '    end for',
  '  else',
  '    for each data(o_i) ∈ N do',
  '      eliminated = false',
  '      if o_p is not null then',
  '        lb = |d_parent - d(o_i, o_p)|',
  '        if lb > r then',
  '          eliminated = true',
  '        end if',
  '      end if',
  '      if not eliminated then',
  '        compute d(o_i, q)',
  '        if d(o_i, q) ≤ r then',
  '          add o_i to S',
  '        end if',
  '      end if',
  '    end for',
  '  end if',
  'return S'
];
  
/**
 * Pseudocode for the k-nearest neighbors (kNN) query algorithm in M-Tree.
 * 
 * This algorithm finds the k closest points to a query point within the M-Tree.
 * It uses a priority queue to efficiently explore the most promising regions
 * of the tree first, and applies pruning based on distance bounds.
 * 
 * The algorithm consists of:
 * 1. Main kNN function that initializes the search 
 * 2. kNNSearchNode function that processes each node during traversal
 * 
 * It maintains a priority queue (PR) of nodes to visit and a collection (NN)
 * of the current k nearest neighbors found so far.
 */
export const PSEUDOCODE_MTREE_KNN = [
  'kNNQuery(T, q, k):',
  ' Insert [T, -] into PR;',
  ' r = ∞;',
  ' empty NN collection with capacity k',
  ' While PR ≠ ∅ do',
  '   Sort PR by dmin values;',
  '   nextnode = Remove and get o_i with minimal dmin from PR;',
  '   kNNSearchNode(nextnode, q, k, NN, PR, r);',
  '   r = NN[k].distance;',
  '   Remove from PR all entries for which dmin > r',
  ' end While',
  'return NN;',
  '----------------------------------------',
  'kNNSearchNode(N, q, k, NN, PR, r):', // Part 3: kNNSearchNode
  ' Let o_p be the parent object of node N;',
  '  if N is not a leaf node then',
  '    for each rout(o_i) ∈ N do',
  '      eliminated = false',
  '      if o_p is not null then',
  '        lb = |d(o_p, q) - d(o_i, o_p)|',
  '        sumR = r + r_o_i',
  '        if lb > sumR then',
  '          eliminated = true',
  '        end if',
  '      end if',
  '      if not eliminated then',
  '        Compute d(o_i, q);',
  '        dmin = max(0, d(o_i, q) - r_o_i)',
  '        dmax = d(o_i, q) + r_o_i',
  '        if dmin ≤ r then',
  '          Append [ptr(T(o_i)), dmin] to PR;',
  '        end if',
  '        if dmax ≤ r then',
  '          r = NNUpdate(NN, [-, dmax]);',
  '          Remove from PR all entries for which dmin > r;',
  '        end if',
  '      end if',
  '    end for',
  '  else',
  '    for each grnd(o_i) ∈ N do',
  '      eliminated = false',
  '      if o_p is not null then',
  '        lb = |d(o_p, q) - d(o_i, o_p)|',
  '        if lb > r then',
  '          eliminated = true',
  '        end if',
  '      end if',
  '      if not eliminated then',
  '        compute d(o_i, q);',
  '        if d(o_i, q) ≤ r then',
  '          r = NNUpdate(NN, [o_i, d(o_i, q)]);',
  '          Remove from PR all entries for which dmin > r;',
  '        end if',
  '      end if',
  '    end for',
  '  end if',
  'END'
];