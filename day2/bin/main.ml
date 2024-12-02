let file = "input.txt"

let read_whole_file filename =
    let ch = open_in filename in
    let s = really_input_string ch (in_channel_length ch) in
    close_in ch;
    s


let is_valid a = a > 0 && a < 4
let is_safe row =
  let rec is_safe' row' increasing =
    let first = List.hd row' in
    let second = List.hd (List.tl row') in
    let diff = Int.abs(second - first) in
    if first = second  then false
    else if increasing && first > second then false
    else if increasing = false && first < second then false
    else if (is_valid diff) = false then false
    else if List.length row' = 2 then true
    else is_safe' (List.tl row') increasing
  in
  is_safe' row (List.hd row < List.hd (List.tl row))

let part1 =
  let file_contents = read_whole_file file in
  let lines = String.split_on_char '\n' file_contents in
  let list = List.map (Str.split (Str.regexp " ")) lines in
  let numbers = List.map (List.map int_of_string) list in
  let filtered = List.filter is_safe numbers in
  List.length filtered


let check_lists list =
  let rec check_lists' list' curr_index length =
    if curr_index = length then []
    else
    let lst = List.filteri (fun i _ -> i != curr_index) list' in
   
    let safe = is_safe lst in
    safe :: check_lists' list' (curr_index + 1) length
  in
  check_lists' list 0 (List.length list)

let part2 = 
  let file_contents = read_whole_file file in
  let lines = String.split_on_char '\n' file_contents in
  let list = List.map (Str.split (Str.regexp " ")) lines in
  let numbers = List.map (List.map int_of_string) list in
  let filtered = List.filter is_safe numbers in
  let checked = List.filter (fun x -> is_safe x = false) numbers in
  let filtered2 = List.filter (fun x ->
    let safe = check_lists x in
    List.mem true safe
  ) checked in
  (List.length filtered) + (List.length filtered2)
let () = print_int part1; print_newline (); print_int part2; print_newline ()

