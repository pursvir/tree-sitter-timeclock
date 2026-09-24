/**
 * @file Tree-sitter grammar for Hledger's subset of Timeclock files.
 * @author pursvir
 * @license MIT
 */

export default grammar({
  name: "timeclock",

  extras: $ => [],
  
  rules: {
    // TODO: documents which are not terminated by \r?\n will produce error.
    source_file: $ => repeat(choice(
      $.session,
      $.clock_in_entry,
      $.break_entry,
      $.holiday_entry,
      $.override_entry,
      $._comment_line,
      $._blank,
    )),

    session: $ => prec.right(1, seq(
      $.clock_in_entry,
      repeat(choice($._blank, $._comment_line, $.session)),
      // Nested incompleted sessions are allowed.
      optional($.clock_out_entry),
    )),

    _comment_line: $ => seq(optional($._spaces), $.comment, $._eol),
    
    // TODO: tags support
    clock_in_entry: $ => seq(
      $.clock_in_marker, $._entry_body, $._eol,
    ),

    clock_out_entry: $ => seq(
      $.clock_out_marker, $._entry_body, $._eol,
    ),

    break_entry: $ => seq(
      $.break_marker, $._entry_body, $._eol,
    ),
    
    holiday_entry: $ => seq(
      $.holiday_marker, $._entry_body, $._eol,
    ),

    override_entry: $ => seq(
      $.override_marker, $._entry_body, $._eol,
    ),

    _entry_body: $ => seq(
      " ", $.simple_date,
      " ", $.time, optional($.tz_offset), 
      // TODO: normally, those tokens may exist in clock-outs only if associated clock-in is nested inside other one!
      // TODO: a bit incorrect parsing logic. For clock-ins, accounts are mandatory part!
      optional(seq(" ", $._entry_suffix)),
    ),

    _entry_suffix: $ => choice(
      prec(2, seq($.account, /[ ]{2,}/, $.description, optional(seq(optional($._spaces), $.comment)))),
      prec(1, seq(optional($._spaces), $.comment)),
      $.account,
      $._spaces,
    ),

    clock_in_marker: $ => "i",
    clock_out_marker: $ => "o",

    // Legacy prefixes
    break_marker: $ => "b",
    holiday_marker: $ => "h",
    override_marker: $ => "O",

    simple_date: $ => choice(
      /[1-9]\d{3}-\d{2}-\d{2}/,
      /[1-9]\d{3}\/\d{2}\/\d{2}/
    ),
    time: $ => /(?:[0-1]\d|2[0-3])\:[0-5]\d(?:\:[0-5]\d)?/,
    tz_offset: $ => /[+-](?:[0-1]\d|2[0-3])[0-5]\d/,

    account: $ => seq(
      $._account_char,
      repeat(choice(
        $._account_char,
        seq(" ", $._account_char), 
      )),
    ),
    _account_char: $ => /[^#;* \t\r\n]/,
    
    description: $ => /[^#;*\r\n]+/,
    comment: $ => /[#;*][^\r\n]*/,

    _blank: $ => seq(optional($._spaces), $._eol),
    _spaces: $ => /[ \t]+/,
    _eol: $ => /\r?\n/,
  }
});
