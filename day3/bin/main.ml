let file = "input.txt"

let read_whole_file filename =
    let ch = open_in filename in
    let s = really_input_string ch (in_channel_length ch) in
    close_in ch;
    s

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
let () = print_int part1; print_newline ()
