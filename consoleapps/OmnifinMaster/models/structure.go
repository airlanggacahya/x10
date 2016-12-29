package models

type Node struct {
	Children map[string]Nodes
	Data     string
}

type Nodes []*Node

func (node *Node) AddChild(s string, c *Node) {
	if node.Children == nil {
		node.Children = map[string]Nodes{}
	}

	node.Children[s] = append(node.Children[s], c)
}

func (n *Node) HasChildren() bool {
	return len(n.Children) > 0
}

// -----------------------------------------------

type Element struct {
	parent *Element
	n      *Node
	label  string
}
