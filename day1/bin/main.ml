let file = "input.txt"

let read_whole_file filename =
    let ch = open_in filename in
    let s = really_input_string ch (in_channel_length ch) in
    close_in ch;
    s


let part1 =
  let s = read_whole_file file in
  let pairs = String.split_on_char '\n' s in
  let trimmed = List.map (fun x -> Str.global_replace (Str.regexp "   ") "," x) pairs in
  let firstMembers = List.map (fun x -> Str.string_before x ((String.index_from x 0 ','))  ) trimmed in
  let secondMembers = List.map (fun x -> Str.string_after x ((String.index_from x 0 ',') + 1)  ) trimmed in
  let firstSorted = List.sort compare firstMembers in
  let secondSorted = List.sort compare secondMembers in
  let zipped = List.combine firstSorted secondSorted in
  let sums = List.map (fun (x, y) ->
    let xi = int_of_string x in
    let yi = int_of_string y in
    if xi > yi then xi - yi else yi - xi
    ) zipped in
  let sum = List.fold_left (+) 0 sums in
  string_of_int sum

let () = print_endline part1
    
