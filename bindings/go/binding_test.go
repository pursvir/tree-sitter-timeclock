package tree_sitter_timeclock_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_timeclock "github.com/pursvir/tree-sitter-timeclock/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_timeclock.Language())
	if language == nil {
		t.Errorf("Error loading Timeclock grammar")
	}
}
