let file = "input.txt"

let read_whole_file filename =
    let ch = open_in filename in
    let s = really_input_string ch (in_channel_length ch) in
    close_in ch;
    s

let evaluate_instructions instructions =
  let rec evaluate_instructions' instructions skip acc =
    match instructions with
    | [] -> acc
    | x :: xs -> 
        match x with
        | "don't()" -> evaluate_instructions' xs true acc
        | "do()" -> evaluate_instructions' xs false acc
        | _ -> 
          if skip then
            evaluate_instructions' xs true acc
          else
            let reg = Str.regexp "mul(\\([0-9]+\\),\\([0-9]+\\))" in
            let _ = Str.search_forward reg x 0 in
            let a = int_of_string (Str.matched_group 1 x) in
            let b = int_of_string (Str.matched_group 2 x) in
            evaluate_instructions' xs false (acc + (a * b))
  in
  evaluate_instructions' instructions false 0

let part1 = 
    let input = read_whole_file file in
    let lines = String.split_on_char '\n' input in
    (* extract mul(x,y) from lines *)
    let reg = Str.regexp "mul(\\([0-9]+\\),\\([0-9]+\\))" in
    let full_row = List.fold_left (fun acc x -> acc ^ x) "" lines in
    let extract_mul row start =
      let rec extract_mul' row start =
        try
          let _ = Str.search_forward reg row start in
          let x = int_of_string (Str.matched_group 1 row) in
          let y = int_of_string (Str.matched_group 2 row) in
          (x * y) + (extract_mul' row (Str.match_end ()))
        with Not_found -> 0
      in extract_mul' row start
    in
    let mul = extract_mul full_row 0 in
    mul
let part2 = 
  let input = read_whole_file file in
  let lines = String.split_on_char '\n' input in
  let full_row = List.fold_left (fun acc x -> acc ^ x) "" lines in
  let valid_instructions = Str.regexp "\\(don't()\\|do()\\|mul([0-9]+,[0-9]+)\\)" in
  let rec parse_instructions row start =
    try
      let _ = Str.search_forward valid_instructions row start in
      let matched = Str.matched_string row in
      matched :: parse_instructions row (Str.match_end ())
    with Not_found -> []
  in 
  let instructions = parse_instructions full_row 0 in
  let anser = evaluate_instructions instructions in
  anser

let () = print_int part1; print_newline (); print_int part2; print_newline ()
