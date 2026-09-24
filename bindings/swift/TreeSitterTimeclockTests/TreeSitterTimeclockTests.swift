import XCTest
import SwiftTreeSitter
import TreeSitterTimeclock

final class TreeSitterTimeclockTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_timeclock())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Timeclock grammar")
    }
}
